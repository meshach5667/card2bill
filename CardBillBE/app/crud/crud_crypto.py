from typing import Any, Dict, Optional, List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.crypto import Crypto, CryptoTransaction
from app.models.user import User
from app.schemas.crypto import CryptoCreate, CryptoUpdate, CryptoTransactionCreate, CryptoTransactionUpdate


class CRUDCrypto:
    async def get(self, db: AsyncSession, id: UUID) -> Optional[Crypto]:
        """
        Get a crypto by ID
        """
        result = await db.execute(select(Crypto).where(Crypto.id == id))
        return result.scalars().first()
        
    async def get_by_symbol(self, db: AsyncSession, symbol: str) -> Optional[Crypto]:
        """
        Get a crypto by symbol
        """
        result = await db.execute(select(Crypto).where(Crypto.symbol == symbol))
        return result.scalars().first()
        
    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100, active_only: bool = True
    ) -> List[Crypto]:
        """
        Get multiple cryptos with pagination
        """
        query = select(Crypto)
        if active_only:
            query = query.where(Crypto.is_active == True)
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
        
    async def create(self, db: AsyncSession, *, obj_in: CryptoCreate) -> Crypto:
        """
        Create a new crypto
        """
        db_obj = Crypto(
            name=obj_in.name,
            symbol=obj_in.symbol,
            buy_rate=obj_in.buy_rate,
            sell_rate=obj_in.sell_rate,
            logo_url=obj_in.logo_url,
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def update(
        self, db: AsyncSession, *, db_obj: Crypto, obj_in: CryptoUpdate
    ) -> Crypto:
        """
        Update a crypto
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def delete(self, db: AsyncSession, *, id: UUID) -> Crypto:
        """
        Delete a crypto (soft delete by setting is_active=False)
        """
        obj = await self.get(db, id=id)
        if obj:
            obj.is_active = False
            db.add(obj)
            await db.commit()
            await db.refresh(obj)
        return obj


class CRUDCryptoTransaction:
    async def get(self, db: AsyncSession, id: UUID) -> Optional[CryptoTransaction]:
        """
        Get a transaction by ID
        """
        result = await db.execute(select(CryptoTransaction).where(CryptoTransaction.id == id))
        return result.scalars().first()
        
    async def get_multi(
        self, db: AsyncSession, *, user_id: Optional[UUID] = None, 
        skip: int = 0, limit: int = 100
    ) -> List[CryptoTransaction]:
        """
        Get multiple transactions with pagination
        """
        query = select(CryptoTransaction)
        if user_id:
            query = query.where(CryptoTransaction.user_id == user_id)
        query = query.order_by(CryptoTransaction.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
        
    async def create(
        self, db: AsyncSession, *, obj_in: CryptoTransactionCreate, user: User
    ) -> CryptoTransaction:
        """
        Create a new crypto transaction
        """
        # Calculate total based on amount and price
        total = obj_in.amount * obj_in.price
        
        db_obj = CryptoTransaction(
            user_id=user.id,
            crypto_type=obj_in.crypto_type,
            transaction_type=obj_in.transaction_type,
            amount=obj_in.amount,
            price=obj_in.price,
            total=total,
            wallet_address=obj_in.wallet_address
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def update(
        self, db: AsyncSession, *, 
        db_obj: CryptoTransaction, 
        obj_in: CryptoTransactionUpdate,
        admin_id: Optional[UUID] = None
    ) -> CryptoTransaction:
        """
        Update a transaction
        """
        update_data = obj_in.dict(exclude_unset=True)
        
        # Set admin ID if provided
        if admin_id:
            update_data["admin_id"] = admin_id
            
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj


crypto = CRUDCrypto()
crypto_transaction = CRUDCryptoTransaction()