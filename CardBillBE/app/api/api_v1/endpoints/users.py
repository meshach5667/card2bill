from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, UserUpdate, UserCreate
from app.crud.crud_user import user as crud_user
from app.utils.file_upload import save_profile_picture

router = APIRouter()


@router.get("/me", response_model=UserSchema)
async def read_user_me(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get current user
    """
    return current_user



@router.put("/me", response_model=UserSchema)
async def update_user_me(
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update own user data
    """
    # Don't allow setting admin status for self
    if user_in.is_admin is not None:
        user_in.is_admin = current_user.is_admin
        
    return await crud_user.update(db, db_obj=current_user, obj_in=user_in)


@router.post("/me/profile-picture", response_model=UserSchema)
async def upload_profile_picture(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Upload profile picture
    """
    # Save profile picture and get URL
    picture_url = await save_profile_picture(file, user_id=current_user.id)
    
    # Update user with profile picture URL
    current_user = await crud_user.update(
        db, 
        db_obj=current_user, 
        obj_in={"profile_picture": picture_url}
    )
    
    return current_user