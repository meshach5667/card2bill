from typing import Any, Dict, Optional, Union, List
from uuid import UUID
import secrets
import string
from datetime import datetime, timedelta

from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import security
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class CRUDUser:
    async def get(self, db: AsyncSession, id: UUID) -> Optional[User]:
        """
        Get a user by ID
        """
        result = await db.execute(select(User).where(User.id == id))
        return result.scalars().first()

    async def get_by_username(self, db: AsyncSession, username: str) -> Optional[User]:
        """
        Get a user by username
        """
        result = await db.execute(select(User).where(User.username == username))
        return result.scalars().first()

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:

        result = await db.execute(select(User).where(User.email == email))
        return result.scalars().first()

        
    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100
    ) -> List[User]:
        """
        Get multiple users with pagination
        """
        result = await db.execute(select(User).offset(skip).limit(limit))
        return result.scalars().all()
        
    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        """
        Create a new user
        """
        verification_code = ''.join(secrets.choice(string.digits) for _ in range(6))
        
        db_obj = User(
            email=obj_in.email,
            password=security.get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            # username=obj_in.username,
            is_active=obj_in.is_active,
            is_admin=obj_in.is_admin,
            # phone_number=obj_in.phone_number,
            # address=obj_in.address,
            verification_code=verification_code
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def update(
        self, db: AsyncSession, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        """
        Update a user
        """
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
            
        if "password" in update_data and update_data["password"]:
            hashed_password = security.get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["password"] = hashed_password
            
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def delete(self, db: AsyncSession, *, id: UUID) -> User:
        """
        Delete a user
        """
        obj = await self.get(db, id=id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj
        
    async def authenticate(
        self, db: AsyncSession, *, email:EmailStr, password: str
    ) -> Optional[User]:
        """
        Authenticate a user by email and password
        """
        user = await self.get_by_email(db, email=email)
        if not user:
            return None
        if not security.verify_password(password, user.password):
            return None
        return user
        
    async def verify_user(
        self, db: AsyncSession, *, email: str, verification_code: str
    ) -> Optional[User]:
        """
        Verify a user using verification code
        """
        user = await self.get_by_email(db, email=email)
        if not user or user.verification_code != verification_code:
            return None
            
        user.is_verified = True
        user.verification_code = None
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
        
    async def create_reset_code(
        self, db: AsyncSession, *, email: str
    ) -> Optional[User]:
        """
        Create a password reset code
        """
        user = await self.get_by_email(db, email=email)
        if not user:
            return None
            
        reset_code = ''.join(secrets.choice(string.digits) for _ in range(6))
        expires = datetime.utcnow() + timedelta(hours=1)
        
        user.reset_code = reset_code
        user.reset_code_expires = expires
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user
        
    async def reset_password(
        self, db: AsyncSession, *, email: str, reset_code: str, new_password: str
    ) -> Optional[User]:
        """
        Reset password using reset code
        """
        user = await self.get_by_email(db, email=email)
        if (not user or 
            user.reset_code != reset_code or 
            user.reset_code_expires < datetime.utcnow()):
            return None
            
        user.password = security.get_password_hash(new_password)
        user.reset_code = None
        user.reset_code_expires = None
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user


user = CRUDUser()