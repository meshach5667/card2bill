from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Enum, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum

from app.db.base_class import Base




__tablename__ = "withdrawal"

class WithdrawalStatus(str, enum.Enum):
    """Enum for withdrawal statuses"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"


class WithdrawalMethod(str, enum.Enum):
    """Enum for withdrawal methods"""
    BANK = "bank"
    CRYPTO = "crypto"
    MOBILE_MONEY = "mobile_money"


class Withdrawal(Base):
    """
    Database model for withdrawals
    """
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    fee = Column(Float, default=0.0)
    total = Column(Float, nullable=False)  # amount - fee
    method = Column(Enum(WithdrawalMethod), nullable=False)
    account_details = Column(String, nullable=False)  # Bank account or wallet address
    status = Column(Enum(WithdrawalStatus), default=WithdrawalStatus.PENDING)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    processed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)