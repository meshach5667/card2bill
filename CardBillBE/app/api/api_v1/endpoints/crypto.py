from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.crypto import (
    Crypto, CryptoTransaction, CryptoTransactionCreate, CryptoTransactionUpdate
)
from app.crud.crud_crypto import crypto as crud_crypto, crypto_transaction as crud_crypto_transaction

router = APIRouter()


@router.get("/", response_model=List[Crypto])
async def get_cryptos(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get list of available cryptocurrencies
    """
    return await crud_crypto.get_multi(db, skip=skip, limit=limit, active_only=active_only)


@router.get("/{crypto_id}", response_model=Crypto)
async def get_crypto(
    crypto_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific cryptocurrency by ID
    """
    crypto = await crud_crypto.get(db, id=crypto_id)
    if not crypto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cryptocurrency not found"
        )
    return crypto


@router.get("/transactions/", response_model=List[CryptoTransaction])
async def get_transactions(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get list of user's crypto transactions
    """
    return await crud_crypto_transaction.get_multi(
        db, user_id=current_user.id, skip=skip, limit=limit
    )


@router.post("/transactions/", response_model=CryptoTransaction)
async def create_transaction(
    transaction_in: CryptoTransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create a new crypto transaction
    """
    return await crud_crypto_transaction.create(
        db, obj_in=transaction_in, user=current_user
    )


@router.get("/transactions/{transaction_id}", response_model=CryptoTransaction)
async def get_transaction(
    transaction_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific transaction by ID
    """
    transaction = await crud_crypto_transaction.get(db, id=transaction_id)
    if not transaction or transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    return transaction


@router.put("/transactions/{transaction_id}", response_model=CryptoTransaction)
async def update_transaction(
    transaction_id: str,
    transaction_in: CryptoTransactionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update a transaction (limited fields)
    """
    transaction = await crud_crypto_transaction.get(db, id=transaction_id)
    if not transaction or transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
        
    # Users can only update certain fields and can't change status directly
    if transaction_in.status is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Users cannot update transaction status directly"
        )
        
    return await crud_crypto_transaction.update(
        db, db_obj=transaction, obj_in=transaction_in
    )