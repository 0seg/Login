from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from pydantic import field_validator


class UserOut(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    is_active: bool
    username: str
    email: EmailStr
    created_at: datetime


class UserUpdate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)
    
    @field_validator('new_password')
    def new_password_strength(cls, value: str) -> str:
        if (len(value) < 8 or
            not any(char.isupper() for char in value) or
            not any(char.islower() for char in value) or
            not any(char.isdigit() for char in value) or
            not any(char in '!@#$%^&*()-_=+[]{}|;:,.<>?/' for char in value)):
            raise ValueError('Password must contain uppercase, lowercase, digit and special character')
        return value


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)
    
    @field_validator('new_password')
    def reset_password_strength(cls, value: str) -> str:
        if (len(value) < 8 or
            not any(char.isupper() for char in value) or
            not any(char.islower() for char in value) or
            not any(char.isdigit() for char in value) or
            not any(char in '!@#$%^&*()-_=+[]{}|;:,.<>?/' for char in value)):
            raise ValueError('Password must contain uppercase, lowercase, digit and special character')
        return value


class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @field_validator('password')
    def password_strength(cls, value: str) -> str:
        if (len(value) < 8 or
            not any(char.isupper() for char in value) or
            not any(char.islower() for char in value) or
            not any(char.isdigit() for char in value) or
            not any(char in '!@#$%^&*()-_=+[]{}|;:,.<>?/' for char in value)):
            raise ValueError('Password must contain uppercase, lowercase, digit and special character')
        return value


class UserLogin(BaseModel):
    username: str = Field(..., min_length=3)
    password: str = Field(..., min_length=1)


class TokenOut(BaseModel):
    access_token: str
    token_type: str



