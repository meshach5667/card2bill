from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.withdrawal import Withdrawal, WithdrawalCreate, WithdrawalUpdate
from app.crud.crud_withdrawal import withdrawal as crud_withdrawal

router = APIRouter()


@router.get("/", response_model=List[Withdrawal])
async def get_withdrawals(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get list of user's withdrawal requests
    """
    return await crud_withdrawal.get_multi(
        db, user_id=current_user.id, skip=skip, limit=limit
    )


@router.post("/", response_model=Withdrawal)
async def create_withdrawal(
    withdrawal_in: WithdrawalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create a new withdrawal request
    """
    try:
        return await crud_withdrawal.create(
            db, obj_in=withdrawal_in, user=current_user
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{withdrawal_id}", response_model=Withdrawal)
async def get_withdrawal(
    withdrawal_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific withdrawal by ID
    """
    withdrawal = await crud_withdrawal.get(db, id=withdrawal_id)
    if not withdrawal or withdrawal.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Withdrawal not found"
        )
    return withdrawal


@router.put("/{withdrawal_id}", response_model=Withdrawal)
async def update_withdrawal(
    withdrawal_id: str,
    withdrawal_in: WithdrawalUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update a withdrawal request (limited fields)
    """
    withdrawal = await crud_withdrawal.get(db, id=withdrawal_id)
    if not withdrawal or withdrawal.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Withdrawal not found"
        )
        
    # Users can only update certain fields and can't change status directly
    if withdrawal_in.status is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Users cannot update withdrawal status directly"
        )
        
    return await crud_withdrawal.update(
        db, db_obj=withdrawal, obj_in=withdrawal_in
    )