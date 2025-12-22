from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import SessionLocal, engine, Base
from .models import User
from .schemas import UserRegister, UserLogin, UserOut, TokenOut
from .auth import get_password_hash, verify_password, create_access_token, decode_access_token


Base.metadata.create_all(bind=engine) # Crear las tablas en la base de datos
app = FastAPI() # Crear la instancia de la aplicación FastAPI

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

def get_db(): 
    # Dependencia para obtener la sesión de la base de datos
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") # Esquema OAuth2 para la autenticación
 
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Obtener el usuario actual a partir del token de acceso, verificando y decodificando el token
    try:
        payload = decode_access_token(token)
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@app.post("/login", response_model=TokenOut)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Iniciar sesión y devolver un token de acceso si las credenciales son correctas
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=UserOut)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    # Registrar un nuevo usuario si el email o nombre de usuario no están ya registrados, creando un hash de la contraseña
    existing_user = db.query(User).filter((User.email == user_data.email) | (User.username == user_data.username)).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email or username already registered")
    
    hashed_password = get_password_hash(user_data.password)
    new_user = User(username=user_data.username, email=user_data.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@app.get("/me", response_model=UserOut)
# Obtener los detalles del usuario actualmente autenticado
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
