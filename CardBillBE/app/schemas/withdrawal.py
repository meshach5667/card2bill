from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, validator

from app.models.withdrawal import WithdrawalStatus, WithdrawalMethod


class WithdrawalBase(BaseModel):
    amount: float = Field(..., gt=0)
    method: WithdrawalMethod
    account_details: str
    
    @validator("account_details")
    def validate_account_details(cls, v, values):
        # Validate based on withdrawal method
        method = values.get("method")
        if method == WithdrawalMethod.BANK:
            # Basic check for bank account format
            if len(v.split(",")) < 2:
                raise ValueError("Bank account details should include bank name and account number")
        elif method == WithdrawalMethod.CRYPTO:
            # Basic check for crypto wallet address (simplified)
            if len(v) < 26:
                raise ValueError("Invalid crypto wallet address")
        elif method == WithdrawalMethod.MOBILE_MONEY:
            # Basic check for mobile money format
            if not v.replace("+", "").isdigit():
                raise ValueError("Mobile money number should be a valid phone number")
        return v


class WithdrawalCreate(WithdrawalBase):
    pass


class WithdrawalUpdate(BaseModel):
    status: Optional[WithdrawalStatus] = None
    notes: Optional[str] = None


class Withdrawal(WithdrawalBase):
    id: UUID
    user_id: UUID
    fee: float
    total: float
    status: WithdrawalStatus
    admin_id: Optional[UUID] = None
    notes: Optional[str] = None
    processed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Admin processing withdrawal
class AdminWithdrawalUpdate(BaseModel):
    status: WithdrawalStatus
    notes: Optional[str] = None