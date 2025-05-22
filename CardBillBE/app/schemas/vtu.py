from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, validator

from app.models.vtu import VTUServiceType
from app.models.crypto import TransactionStatus


class VTUTransactionBase(BaseModel):
    service_type: VTUServiceType
    provider: str
    recipient: str
    amount: float = Field(..., gt=0)
    
    @validator("recipient")
    def validate_recipient(cls, v, values):
        # Validation based on service type
        service_type = values.get("service_type")
        if service_type in [VTUServiceType.AIRTIME, VTUServiceType.DATA]:
            # Validate phone number format (simplified)
            if not v.replace("+", "").isdigit():
                raise ValueError("Invalid phone number format")
        elif service_type == VTUServiceType.ELECTRICITY:
            # Validate meter number format (simplified)
            if not v.isdigit() or len(v) < 10:
                raise ValueError("Invalid meter number format")
        return v


class VTUTransactionCreate(VTUTransactionBase):
    pass


class VTUTransactionUpdate(BaseModel):
    status: Optional[TransactionStatus] = None
    notes: Optional[str] = None


class VTUTransaction(VTUTransactionBase):
    id: UUID
    user_id: UUID
    reference: Optional[str] = None
    api_response: Optional[Dict[str, Any]] = None
    status: TransactionStatus
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True