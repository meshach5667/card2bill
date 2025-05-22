from datetime import datetime
from typing import Optional
from sqlalchemy import Boolean, Column, String, DateTime, Float
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base_class import Base

class User(Base):
    """
    Database model for users
    """
    __tablename__ = "users"  # This is necessary!

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    username = Column(String, index=True, unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    verification_code = Column(String, nullable=True)
    reset_code = Column(String, nullable=True)
    reset_code_expires = Column(DateTime, nullable=True)
    profile_picture = Column(String, nullable=True)
    # phone_number = Column(String, nullable=True)
    # address = Column(String, nullable=True)