from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Enum, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum

from app.db.base_class import Base



__tablenames__ = ["crypto", "crypto_transaction"]

class CryptoType(str, enum.Enum):
    """Enum for crypto types"""
    BTC = "BTC"
    ETH = "ETH"
    USDT = "USDT"
    BNB = "BNB"
    SOL = "SOL"
    XRP = "XRP"


class TransactionStatus(str, enum.Enum):
    """Enum for transaction statuses"""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class TransactionType(str, enum.Enum):
    """Enum for transaction types"""
    BUY = "buy"
    SELL = "sell"


class Crypto(Base):
    """
    Database model for crypto currencies
    """
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    symbol = Column(String(10), nullable=False, index=True)
    buy_rate = Column(Float, nullable=False)
    sell_rate = Column(Float, nullable=False)
    logo_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class CryptoTransaction(Base):
    """
    Database model for crypto transactions
    """
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    crypto_type = Column(Enum(CryptoType), nullable=False)
    transaction_type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    transaction_hash = Column(String, nullable=True)
    wallet_address = Column(String, nullable=True)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)