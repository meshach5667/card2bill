from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field, validator
import re


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    # username: Optional[str] = None
    is_active: Optional[bool] = True
    is_admin: Optional[bool] = False
    # phone_number: Optional[str] = None
    # address: Optional[str] = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str



    @validator("password")
    def password_strength(cls, v):
        """
        Validate password strength:
        - At least 8 characters
        - Contains at least one uppercase letter
        - Contains at least one lowercase letter
        - Contains at least one number
        """
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        return v


# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None
    
    @validator("password")
    def password_strength(cls, v):
        if v is None:
            return v
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        return v


# Properties for email verification
class UserVerify(BaseModel):
    email: EmailStr
    verification_code: str


# Properties for password reset request
class UserPasswordResetRequest(BaseModel):
    email: EmailStr


# Properties for password reset
class UserPasswordReset(BaseModel):
    email: EmailStr
    reset_code: str
    new_password: str
    
    @validator("new_password")
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        return v


# Additional properties returned from API
class User(UserBase):
    id: UUID
    is_verified: bool
    balance: float
    created_at: datetime
    updated_at: datetime
    profile_picture: Optional[str] = None

    class Config:
        orm_mode = True


# User with token used for login response
class UserWithToken(User):
    access_token: str
    token_type: str = "bearer"


# Admin user creation
class AdminUserCreate(UserCreate):
    is_admin: bool = True