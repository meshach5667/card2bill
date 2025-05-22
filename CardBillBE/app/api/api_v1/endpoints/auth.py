from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token
from app.db.session import get_db
from app.schemas.auth import Token, LoginRequest, LoginResponse
from app.schemas.user import UserCreate, User, UserVerify, UserPasswordResetRequest, UserPasswordReset
from app.crud.crud_user import user as crud_user
from app.utils.email import send_verification_email, send_password_reset_email

router = APIRouter()


@router.post("/register", response_model=User)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Register a new user
    """
    # Check if user already exists
    user = await crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists"
        )
    
    # Create new user
    user = await crud_user.create(db, obj_in=user_in)
    
    # Send verification email
    await send_verification_email(email=user.email, verification_code=user.verification_code)
    
    return user





@router.post("/login", response_model=LoginResponse)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await crud_user.authenticate(db, email=login_data.email, password=login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=str(user.id), expires_delta=access_token_expires
    )
    print(f"access token: {access_token}")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user.id),
        "username": user.username,
        "is_admin": user.is_admin,
        "email": user.email,

    }




@router.post("/token", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = await crud_user.authenticate(db, email=form_data.email, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            subject=str(user.id), expires_delta=access_token_expires
        ),
        "token_type": "bearer"
    }


@router.post("/verify", response_model=User)
async def verify_email(
    verification_data: UserVerify,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Verify user email with verification code
    """
    user = await crud_user.verify_user(
        db, 
        email=verification_data.email, 
        verification_code=verification_data.verification_code
    )
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid verification code"
        )
    return user


@router.post("/password-reset/request", response_model=dict)
async def request_password_reset(
    reset_request: UserPasswordResetRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Request a password reset
    """
    user = await crud_user.create_reset_code(db, email=reset_request.email)
    if not user:
        # Don't reveal that the user doesn't exist
        return {"message": "If your email is registered, you will receive a reset code"}
    
    # Send password reset email
    await send_password_reset_email(email=user.email, reset_code=user.reset_code)
    
    return {"message": "If your email is registered, you will receive a reset code"}


@router.post("/password-reset/verify", response_model=dict)
async def reset_password(
    reset_data: UserPasswordReset,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Reset password with reset code
    """
    user = await crud_user.reset_password(
        db, 
        email=reset_data.email, 
        reset_code=reset_data.reset_code, 
        new_password=reset_data.new_password
    )
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset code"
        )
    return {"message": "Password has been reset successfully"}