from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from pydantic import field_validator

class UserOut(BaseModel):
    model_config = {"from_attributes": True}
    id: int
    is_active: bool
    username: str
    email: EmailStr
    created_at: datetime

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email : EmailStr
    password: str = Field(..., min_length=8)
    # Validar la fortaleza de la contraseña, asegurando que contenga al menos una mayúscula, una minúscula, un número y un carácter especial.
    @field_validator('password')
    def password_strength(cls, value):
        if (len(value) < 8 or
            not any(char.isupper() for char in value) or
            not any(char.islower() for char in value) or
            not any(char.isdigit() for char in value) or
            not any(char in '!@#$%^&*()-_=+[]{}|;:,.<>?/' for char in value)):
            raise ValueError('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.')
        return value

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)

class TokenOut(BaseModel):
    access_token: str
    token_type: str


