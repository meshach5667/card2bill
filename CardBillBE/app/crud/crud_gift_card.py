from typing import Any, Dict, Optional, List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.gift_card import GiftCard, GiftCardTransaction
from app.models.user import User
from app.schemas.gift_card import GiftCardCreate, GiftCardUpdate, GiftCardTransactionCreate, GiftCardTransactionUpdate


class CRUDGiftCard:
    async def get(self, db: AsyncSession, id: UUID) -> Optional[GiftCard]:
        """
        Get a gift card by ID
        """
        result = await db.execute(select(GiftCard).where(GiftCard.id == id))
        return result.scalars().first()
        
    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 100, active_only: bool = True
    ) -> List[GiftCard]:
        """
        Get multiple gift cards with pagination
        """
        query = select(GiftCard)
        if active_only:
            query = query.where(GiftCard.is_active == True)
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
        
    async def create(self, db: AsyncSession, *, obj_in: GiftCardCreate) -> GiftCard:
        """
        Create a new gift card
        """
        db_obj = GiftCard(
            name=obj_in.name,
            type=obj_in.type,
            buy_rate=obj_in.buy_rate,
            sell_rate=obj_in.sell_rate,
            icon_url=obj_in.icon_url,
            denominations=obj_in.denominations,
            countries=obj_in.countries,
            is_active=obj_in.is_active
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def update(
        self, db: AsyncSession, *, db_obj: GiftCard, obj_in: GiftCardUpdate
    ) -> GiftCard:
        """
        Update a gift card
        """
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
            
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def delete(self, db: AsyncSession, *, id: UUID) -> GiftCard:
        """
        Delete a gift card (soft delete by setting is_active=False)
        """
        obj = await self.get(db, id=id)
        if obj:
            obj.is_active = False
            db.add(obj)
            await db.commit()
            await db.refresh(obj)
        return obj


class CRUDGiftCardTransaction:
    async def get(self, db: AsyncSession, id: UUID) -> Optional[GiftCardTransaction]:
        """
        Get a gift card transaction by ID
        """
        result = await db.execute(select(GiftCardTransaction).where(GiftCardTransaction.id == id))
        return result.scalars().first()
        
    async def get_multi(
        self, db: AsyncSession, *, user_id: Optional[UUID] = None, 
        skip: int = 0, limit: int = 100
    ) -> List[GiftCardTransaction]:
        """
        Get multiple gift card transactions with pagination
        """
        query = select(GiftCardTransaction)
        if user_id:
            query = query.where(GiftCardTransaction.user_id == user_id)
        query = query.order_by(GiftCardTransaction.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()
        
    async def create(
        self, db: AsyncSession, *, obj_in: GiftCardTransactionCreate, user: User
    ) -> GiftCardTransaction:
        """
        Create a new gift card transaction
        """
        # Calculate total based on amount and price
        total = obj_in.amount * obj_in.price
        
        db_obj = GiftCardTransaction(
            user_id=user.id,
            gift_card_id=obj_in.gift_card_id,
            transaction_type=obj_in.transaction_type,
            amount=obj_in.amount,
            price=obj_in.price,
            total=total,
            card_code=obj_in.card_code,
            card_pin=obj_in.card_pin,
            card_image_url=obj_in.card_image_url,
            notes=obj_in.notes
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def update(
        self, db: AsyncSession, *, 
        db_obj: GiftCardTransaction, 
        obj_in: GiftCardTransactionUpdate,
        admin_id: Optional[UUID] = None
    ) -> GiftCardTransaction:
        """
        Update a gift card transaction
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


gift_card = CRUDGiftCard()
gift_card_transaction = CRUDGiftCardTransaction()