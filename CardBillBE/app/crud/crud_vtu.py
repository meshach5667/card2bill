from typing import Any, Dict, Optional, List
from uuid import UUID
import secrets
import string

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.vtu import VTUTransaction
from app.models.crypto import TransactionStatus
from app.models.user import User
from app.schemas.vtu import VTUTransactionCreate, VTUTransactionUpdate


class CRUDVTUTransaction:
    async def get(self, db: AsyncSession, id: UUID) -> Optional[VTUTransaction]:
        """
        Get a VTU transaction by ID
        """
        result = await db.execute(select(VTUTransaction).where(VTUTransaction.id == id))
        return result.scalars().first()
        
    async def get_multi(
        self, db: AsyncSession, *, user_id: Optional[UUID] = None, 
        skip: int = 0, limit: int = 100
    ) -> List[VTUTransaction]:
        """
        Get multiple VTU transactions with pagination
        """
        query = select(VTUTransaction)
        if user_id:
            query = query.where(VTUTransaction.user_id == user_id)
        query = query.order_by(VTUTransaction.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
        
    async def create(
        self, db: AsyncSession, *, obj_in: VTUTransactionCreate, user: User
    ) -> VTUTransaction:
        """
        Create a new VTU transaction
        """
        # Check if user has sufficient balance
        if user.balance < obj_in.amount:
            raise ValueError("Insufficient balance")
            
        # Generate unique reference
        reference = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(10))
        
        # Create transaction
        db_obj = VTUTransaction(
            user_id=user.id,
            service_type=obj_in.service_type,
            provider=obj_in.provider,
            recipient=obj_in.recipient,
            amount=obj_in.amount,
            reference=reference,
            status=TransactionStatus.PENDING
        )
        
        # Deduct amount from user's balance
        user.balance -= obj_in.amount
        
        # Add objects to session
        db.add(db_obj)
        db.add(user)
        
        # Commit transaction
        await db.commit()
        await db.refresh(db_obj)
        await db.refresh(user)
        
        return db_obj
        
    async def update(
        self, db: AsyncSession, *, db_obj: VTUTransaction, obj_in: VTUTransactionUpdate
    ) -> VTUTransaction:
        """
        Update a VTU transaction
        """
        update_data = obj_in.dict(exclude_unset=True)
        
        # If status is changed to FAILED, refund the user
        if (obj_in.status == TransactionStatus.FAILED and 
                db_obj.status != TransactionStatus.FAILED):
            # Get user
            result = await db.execute(select(User).where(User.id == db_obj.user_id))
            user = result.scalars().first()
            
            if user:
                # Refund the amount
                user.balance += db_obj.amount
                db.add(user)
        
        # Update transaction object
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        
        return db_obj


vtu_transaction = CRUDVTUTransaction()