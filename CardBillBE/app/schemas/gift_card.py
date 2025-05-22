from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, validator
from app.models.gift_card import GiftCardType
from app.models.crypto import TransactionStatus, TransactionType


class GiftCardBase(BaseModel):
    name: Optional[str]
    type: GiftCardType
    buy_rate: Optional[float] = Field(..., ge=0)
    sell_rate: Optional[float]  = Field(..., ge=0)
    icon_url: Optional[str] = None
    denominations: Optional[List[float]] = Field(default_factory=list)
    countries: Optional[List[str]] = Field(default_factory=list)
    is_active: bool = True


class GiftCardCreate(GiftCardBase):
    pass


class GiftCardUpdate(GiftCardBase):
    name: Optional[str] = None
    type: Optional[GiftCardType] = None
    buy_rate: Optional[float] = Field(None, ge=0)
    sell_rate: Optional[float] = Field(None, ge=0)
    icon_url: Optional[str] = None
    denominations: Optional[List[float]] = None
    countries: Optional[List[str]] = None
    is_active: Optional[bool] = None


class GiftCard(GiftCardBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class GiftCardTransactionBase(BaseModel):
    gift_card_id: UUID = Field(..., alias="cardType")
    transaction_type: TransactionType
    country: Optional[str] = Field(None, alias="country")
    category: Optional[str] = Field(None, alias="category")
    card_type_option: Optional[str] = Field(None, alias="cardTypeOption")
    receipt_type: Optional[str] = Field(None, alias="receiptType")
    amount: float = Field(..., ge=0)
    price: float = Field(..., ge=0, alias="totalNaira")
    card_code: Optional[str] = Field(None, alias="cardNumber")
    card_pin: Optional[str] = Field(None, alias="cardPin")
    card_image_url: Optional[str] = None
    notes: Optional[str] = Field(None, alias="comments")
    email: Optional[str] = Field(None, alias="email")  # For buy transactions

    @validator("card_code", "card_image_url", pre=True, always=True)
    def validate_card_details(cls, v, values):
        if (values.get("transaction_type") == TransactionType.SELL and
                not values.get("card_code") and
                not values.get("card_image_url")):
            raise ValueError("Card code or card image is required for sell transactions")
        return v


class GiftCardTransactionCreate(GiftCardTransactionBase):
    pass


class GiftCardTransactionUpdate(BaseModel):
    status: Optional[TransactionStatus] = None
    notes: Optional[str] = None


class GiftCardTransaction(GiftCardTransactionBase):
    id: UUID
    user_id: UUID
    total: float = Field(..., ge=0)
    status: TransactionStatus
    admin_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    gift_card: Optional[GiftCard] = None

    class Config:
        orm_mode = True


class AdminGiftCardTransactionUpdate(BaseModel):
    status: TransactionStatus
    notes: Optional[str] = None

class GiftCardTransaction(GiftCardTransactionBase):
    id: Optional[UUID]
    user_id:  Optional[UUID]
    total: float = Field(..., ge=0)
    status: TransactionStatus
    admin_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    gift_card: Optional[GiftCard] = None

    class Config:
        orm_mode = True


class AdminGiftCardTransactionUpdate(BaseModel):
    status: TransactionStatus
    notes: Optional[str] = None