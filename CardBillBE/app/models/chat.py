from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base_class import Base


class ChatMessage(Base):
    """
    Database model for chat messages
    """
    __tablename__ = "chat_message"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    message = Column(Text, nullable=False)
    is_from_admin = Column(Boolean, default=False)
    is_read = Column(Boolean, default=False)
    attachment_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)