from typing import Any, Dict, Optional, List
from uuid import UUID
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.withdrawal import Withdrawal, WithdrawalStatus
from app.models.user import User
from app.schemas.withdrawal import WithdrawalCreate, WithdrawalUpdate


class CRUDWithdrawal:
    async def get(self, db: AsyncSession, id: UUID) -> Optional[Withdrawal]:
        """
        Get a withdrawal by ID
        """
        result = await db.execute(select(Withdrawal).where(Withdrawal.id == id))
        return result.scalars().first()
        
    async def get_multi(
        self, db: AsyncSession, *, user_id: Optional[UUID] = None, 
        status: Optional[WithdrawalStatus] = None,
        skip: int = 0, limit: int = 100
    ) -> List[Withdrawal]:
        """
        Get multiple withdrawals with pagination
        """
        query = select(Withdrawal)
        
        if user_id:
            query = query.where(Withdrawal.user_id == user_id)
            
        if status:
            query = query.where(Withdrawal.status == status)
            
        query = query.order_by(Withdrawal.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
        
    async def create(
        self, db: AsyncSession, *, obj_in: WithdrawalCreate, user: User
    ) -> Withdrawal:
        """
        Create a new withdrawal request
        """
        # Calculate fee (2% of withdrawal amount)
        fee = obj_in.amount * 0.02
        total = obj_in.amount - fee
        
        # Check if user has sufficient balance
        if user.balance < obj_in.amount:
            raise ValueError("Insufficient balance")
            
        # Create withdrawal request
        db_obj = Withdrawal(
            user_id=user.id,
            amount=obj_in.amount,
            fee=fee,
            total=total,
            method=obj_in.method,
            account_details=obj_in.account_details,
            status=WithdrawalStatus.PENDING
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
        self, db: AsyncSession, *, 
        db_obj: Withdrawal, 
        obj_in: WithdrawalUpdate,
        admin_id: Optional[UUID] = None
    ) -> Withdrawal:
        """
        Update a withdrawal
        """
        update_data = obj_in.dict(exclude_unset=True)
        
        # Set admin ID if provided
        if admin_id:
            update_data["admin_id"] = admin_id
            
        # If status is changed to REJECTED, refund the user
        if (obj_in.status == WithdrawalStatus.REJECTED and 
                db_obj.status != WithdrawalStatus.REJECTED):
            # Get user
            result = await db.execute(select(User).where(User.id == db_obj.user_id))
            user = result.scalars().first()
            
            if user:
                # Refund the original amount
                user.balance += db_obj.amount
                db.add(user)
                
            # Set processed time
            update_data["processed_at"] = datetime.utcnow()
            
        # If status is changed to COMPLETED, set processed time
        elif (obj_in.status == WithdrawalStatus.COMPLETED and 
                db_obj.status != WithdrawalStatus.COMPLETED):
            update_data["processed_at"] = datetime.utcnow()
            
        # Update withdrawal object
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        
        return db_obj


withdrawal = CRUDWithdrawal()