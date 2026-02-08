from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import logging
from datetime import datetime, timedelta

from .database import SessionLocal, engine, Base
from .models import User
from .schemas import UserRegister, UserLogin, UserOut, TokenOut, UserUpdate, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest
from .auth import get_password_hash, verify_password, create_access_token, decode_access_token, generate_reset_token

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Auth API",
    description="API de autenticación con JWT",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

login_attempts: dict[str, tuple[int, datetime]] = {}

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = decode_access_token(token)
        user_id: int | None = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    except Exception as e:
        logger.warning(f"Token validation failed: {str(e)}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@app.post("/login", response_model=TokenOut)
def login(user_data: UserLogin, db: Session = Depends(get_db)) -> TokenOut:
    username_key: str = f"login_{user_data.username}"
    now: datetime = datetime.now()
    
    if username_key in login_attempts:
        attempts, last_attempt = login_attempts[username_key]
        if (now - last_attempt).seconds < 300 and attempts >= 5:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Try again later."
            )
        if (now - last_attempt).seconds < 300:
            login_attempts[username_key] = (attempts + 1, now)
        else:
            login_attempts[username_key] = (1, now)
    else:
        login_attempts[username_key] = (1, now)
    
    user: User | None = db.query(User).filter(User.username == user_data.username).first()
    
    if not user or not verify_password(user_data.password, user.hashed_password):
        logger.warning(f"Failed login attempt: {user_data.username}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    login_attempts.pop(username_key, None)
    access_token: str = create_access_token(data={"sub": str(user.id)})
    logger.info(f"Login: {user.id}")
    return TokenOut(access_token=access_token, token_type="bearer")

@app.post("/register", response_model=UserOut)
def register(user_data: UserRegister, db: Session = Depends(get_db)) -> UserOut:
    existing_user: User | None = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        logger.warning(f"Registration attempt: {user_data.email}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email or username already registered")
    
    hashed_password: str = get_password_hash(user_data.password)
    new_user = User(username=user_data.username, email=user_data.email, hashed_password=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    logger.info(f"Register: {new_user.id}")
    return new_user

@app.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)) -> UserOut:
    return current_user

@app.put("/me", response_model=UserOut)
def update_user(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> UserOut:
    existing_user = db.query(User).filter(
        (User.email == user_update.email) & (User.id != current_user.id)
    ).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already in use")
    
    existing_username = db.query(User).filter(
        (User.username == user_update.username) & (User.id != current_user.id)
    ).first()
    if existing_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    
    current_user.username = user_update.username
    current_user.email = user_update.email
    
    db.commit()
    db.refresh(current_user)
    logger.info(f"Updated profile: {current_user.id}")
    return current_user

@app.post("/change-password")
def change_password(password_data: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict[str, str]:
    if not verify_password(password_data.current_password, current_user.hashed_password):
        logger.warning(f"Failed password change attempt: {current_user.id}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Current password is incorrect")
    
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    logger.info(f"Password changed: {current_user.id}")
    return {"message": "Password changed successfully"}

@app.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    user: User | None = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        logger.warning(f"Forgot password request for non-existent email: {request.email}")
        return {"message": "If email exists, reset token has been sent"}
    
    reset_token: str = generate_reset_token()
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(minutes=30)
    
    db.commit()
    logger.info(f"Reset token generated: {user.id}")
    
    print(f"\n🔑 RESET TOKEN for {request.email}:")
    print(f"Token: {reset_token}\n")
    
    return {"message": "Reset token sent to email (check console for testing)"}

@app.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    user: User | None = db.query(User).filter(User.reset_token == request.token).first()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token")
    
    if user.reset_token_expires is None or datetime.utcnow() > user.reset_token_expires:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token has expired")
    
    user.hashed_password = get_password_hash(request.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    
    db.commit()
    logger.info(f"Password reset: {user.id}")
    return {"message": "Password reset successfully"}

@app.post("/logout")
def logout(current_user: User = Depends(get_current_user)) -> dict[str, str]:
    logger.info(f"Logout: {current_user.id}")
    return {"message": "Logged out successfully"}
