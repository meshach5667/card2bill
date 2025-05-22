from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Enum, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum

from app.db.base_class import Base
from app.models.crypto import TransactionStatus


__tablename__ = "vtu_transaction"

class VTUServiceType(str, enum.Enum):
    """Enum for VTU service types"""
    AIRTIME = "airtime"
    DATA = "data"
    ELECTRICITY = "electricity"
    CABLE = "cable"
    WATER = "water"
    INTERNET = "internet"


class VTUTransaction(Base):
    """
    Database model for VTU transactions
    """
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    service_type = Column(Enum(VTUServiceType), nullable=False)
    provider = Column(String, nullable=False)  # e.g., MTN, Airtel, DSTV
    recipient = Column(String, nullable=False)  # Phone number or account number
    amount = Column(Float, nullable=False)
    reference = Column(String, nullable=True)
    api_response = Column(JSON, nullable=True)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)