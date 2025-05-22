from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, validator
from app.models.crypto import CryptoType, TransactionStatus, TransactionType


class CryptoBase(BaseModel):
    name: str
    symbol: str
    buy_rate: float = Field(..., gt=0)
    sell_rate: float = Field(..., gt=0)
    logo_url: Optional[str] = None
    is_active: bool = True


class CryptoCreate(CryptoBase):
    pass


class CryptoUpdate(CryptoBase):
    name: Optional[str] = None
    symbol: Optional[str] = None
    buy_rate: Optional[float] = None
    sell_rate: Optional[float] = None
    logo_url: Optional[str] = None
    is_active: Optional[bool] = None


class Crypto(CryptoBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Crypto Transaction Schemas
class CryptoTransactionBase(BaseModel):
    crypto_type: CryptoType
    transaction_type: TransactionType
    amount: float = Field(..., gt=0)
    price: float = Field(..., gt=0)
    wallet_address: Optional[str] = None
    
    @validator("wallet_address")
    def validate_wallet_address(cls, v, values):
        if values.get("transaction_type") == TransactionType.SELL and not v:
            raise ValueError("Wallet address is required for sell transactions")
        return v


class CryptoTransactionCreate(CryptoTransactionBase):
    pass


class CryptoTransactionUpdate(BaseModel):
    status: Optional[TransactionStatus] = None
    transaction_hash: Optional[str] = None
    notes: Optional[str] = None


class CryptoTransaction(CryptoTransactionBase):
    id: UUID
    user_id: UUID
    total: float
    status: TransactionStatus
    transaction_hash: Optional[str] = None
    admin_id: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Admin processing transaction
class AdminCryptoTransactionUpdate(BaseModel):
    status: TransactionStatus
    transaction_hash: Optional[str] = None
    notes: Optional[str] = None