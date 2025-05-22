from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.gift_card import (
    GiftCard, GiftCardTransaction, GiftCardTransactionCreate, GiftCardTransactionUpdate
)
from app.crud.crud_gift_card import (
    gift_card as crud_gift_card, 
    gift_card_transaction as crud_gift_card_transaction
)
from app.utils.file_upload import save_gift_card_image

router = APIRouter()


@router.get("/", response_model=List[GiftCard])
async def get_gift_cards(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get list of available gift cards
    """
    return await crud_gift_card.get_multi(db, skip=skip, limit=limit, active_only=active_only)


@router.get("/{gift_card_id}", response_model=GiftCard)
async def get_gift_card(
    gift_card_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific gift card by ID
    """
    gift_card = await crud_gift_card.get(db, id=gift_card_id)
    if not gift_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gift card not found"
        )
    return gift_card


@router.get("/transactions/", response_model=List[GiftCardTransaction])
async def get_transactions(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get list of user's gift card transactions
    """
    return await crud_gift_card_transaction.get_multi(
        db, user_id=current_user.id, skip=skip, limit=limit
    )


@router.post("/transactions/", response_model=GiftCardTransaction)
async def create_transaction(
    transaction_in: GiftCardTransactionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create a new gift card transaction
    """
    # Validate gift card exists
    gift_card = await crud_gift_card.get(db, id=transaction_in.gift_card_id)
    if not gift_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gift card not found"
        )
        
    return await crud_gift_card_transaction.create(
        db, obj_in=transaction_in, user=current_user
    )


@router.post("/transactions/upload-card-image", response_model=dict)
async def upload_gift_card_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Upload gift card image and get URL to include in transaction creation
    """
    # Save gift card image and get URL
    image_url = await save_gift_card_image(file, user_id=current_user.id)
    
    return {"card_image_url": image_url}


@router.get("/transactions/{transaction_id}", response_model=GiftCardTransaction)
async def get_transaction(
    transaction_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get a specific gift card transaction by ID
    """
    transaction = await crud_gift_card_transaction.get(db, id=transaction_id)
    if not transaction or transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    return transaction


@router.put("/transactions/{transaction_id}", response_model=GiftCardTransaction)
async def update_transaction(
    transaction_id: str,
    transaction_in: GiftCardTransactionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Update a gift card transaction (limited fields)
    """
    transaction = await crud_gift_card_transaction.get(db, id=transaction_id)
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
        
    return await crud_gift_card_transaction.update(
        db, db_obj=transaction, obj_in=transaction_in
    )