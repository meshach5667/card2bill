from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, Enum, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
import uuid
import enum

from app.db.base_class import Base
from app.models.crypto import TransactionStatus, TransactionType


__tablenames__ = ["giftcard", "giftcard_transaction"]

class GiftCardType(str, enum.Enum):
    """Enum for gift card types"""
    AMAZON = "amazon"
    APPLE = "apple"
    GOOGLE_PLAY = "google_play"
    STEAM = "steam"
    PLAYSTATION = "playstation"
    XBOX = "xbox"
    NETFLIX = "netflix"
    SPOTIFY = "spotify"
    OTHER = "other"


class GiftCard(Base):
    """
    Database model for gift card types
    """
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    type = Column(Enum(GiftCardType), nullable=False, index=True)
    buy_rate = Column(Float, nullable=False)
    sell_rate = Column(Float, nullable=False)
    icon_url = Column(String, nullable=True)
    denominations = Column(JSONB, nullable=False, default=[])  # usually array, better default to empty list than None
    countries = Column(JSONB, nullable=False, default=[])  # same here
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class GiftCardTransaction(Base):
    """
    Database model for gift card transactions
    """
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    gift_card_id = Column(UUID(as_uuid=True), ForeignKey("giftcard.id"), nullable=False)
    transaction_type = Column(Enum(TransactionType), nullable=False)
    amount = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    total = Column(Float, nullable=False)
    card_code = Column(String, nullable=False, default="")  # if frontend expects empty string instead of None
    card_pin = Column(String, nullable=False, default="")
    card_image_url = Column(String, nullable=True)
    status = Column(Enum(TransactionStatus), default=TransactionStatus.PENDING, nullable=False)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True, default="")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
