from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.vtu import VTUTransaction, VTUTransactionCreate
from app.crud.crud_vtu import vtu_transaction as crud_vtu_transaction
from app.utils.vtu_provider import process_vtu_transaction

router = APIRouter()


@router.get("/transactions", response_model=List[VTUTransaction])
async def get_vtu_transactions(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get list of user's VTU transactions
    """
    return await crud_vtu_transaction.get_multi(
        db, user_id=current_user.id, skip=skip, limit=limit
    )


@router.post("/transactions", response_model=VTUTransaction)
async def create_vtu_transaction(
    transaction_in: VTUTransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create a new VTU transaction
    """
    try:
        # Create transaction in pending state
        transaction = await crud_vtu_transaction.create(
            db, obj_in=transaction_in, user=current_user
        )
        
        # Process transaction with VTU provider
        # This would typically be done asynchronously in a background task
        await process_vtu_transaction(db, transaction)
        
        # Get updated transaction
        transaction = await crud_vtu_transaction.get(db, id=transaction.id)
        
        return transaction
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/transactions/{transaction_id}", response_model=VTUTransaction)
async def get_vtu_transaction(
    transaction_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific VTU transaction by ID
    """
    transaction = await crud_vtu_transaction.get(db, id=transaction_id)
    if not transaction or transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    return transaction