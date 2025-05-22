from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_admin_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import User as UserSchema, AdminUserCreate, UserUpdate
from app.schemas.crypto import (
    Crypto, CryptoCreate, CryptoUpdate, 
    CryptoTransaction, AdminCryptoTransactionUpdate
)
from app.schemas.gift_card import (
    GiftCard, GiftCardCreate, GiftCardUpdate, 
    GiftCardTransaction, AdminGiftCardTransactionUpdate
)
from app.schemas.withdrawal import Withdrawal, AdminWithdrawalUpdate
from app.schemas.chat import ChatMessage, AdminChatMessageCreate
from app.crud.crud_user import user as crud_user
from app.crud.crud_crypto import crypto as crud_crypto, crypto_transaction as crud_crypto_transaction
from app.crud.crud_gift_card import gift_card as crud_gift_card, gift_card_transaction as crud_gift_card_transaction
from app.crud.crud_withdrawal import withdrawal as crud_withdrawal
from app.crud.crud_chat import chat_message as crud_chat_message
from app.utils.websocket_manager import WebSocketManager

router = APIRouter()
ws_manager = WebSocketManager()


# Admin User Management
@router.get("/users", response_model=List[UserSchema])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Get list of all users
    """
    return await crud_user.get_multi(db, skip=skip, limit=limit)


@router.post("/users", response_model=UserSchema)
async def create_admin_user(
    user_in: AdminUserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Create a new admin user
    """
    # Check if user already exists
    user = await crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists"
        )
    
    # Create new admin user
    return await crud_user.create(db, obj_in=user_in)


@router.get("/users/{user_id}", response_model=UserSchema)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Get a specific user by ID
    """
    user = await crud_user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user


@router.put("/users/{user_id}", response_model=UserSchema)
async def update_user(
    user_id: str,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Update a user
    """
    user = await crud_user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    return await crud_user.update(db, db_obj=user, obj_in=user_in)


# Admin Crypto Management
@router.post("/crypto", response_model=Crypto)
async def create_crypto(
    crypto_in: CryptoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Create a new cryptocurrency
    """
    return await crud_crypto.create(db, obj_in=crypto_in)


@router.put("/crypto/{crypto_id}", response_model=Crypto)
async def update_crypto(
    crypto_id: str,
    crypto_in: CryptoUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Update a cryptocurrency
    """
    crypto = await crud_crypto.get(db, id=crypto_id)
    if not crypto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cryptocurrency not found"
        )
        
    return await crud_crypto.update(db, db_obj=crypto, obj_in=crypto_in)


@router.get("/crypto/transactions", response_model=List[CryptoTransaction])
async def get_all_crypto_transactions(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Get all crypto transactions
    """
    return await crud_crypto_transaction.get_multi(db, skip=skip, limit=limit)


@router.put("/crypto/transactions/{transaction_id}", response_model=CryptoTransaction)
async def admin_update_crypto_transaction(
    transaction_id: str,
    transaction_in: AdminCryptoTransactionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Admin update for a crypto transaction
    """
    transaction = await crud_crypto_transaction.get(db, id=transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
        
    return await crud_crypto_transaction.update(
        db, db_obj=transaction, obj_in=transaction_in, admin_id=current_user.id
    )


# Admin Gift Card Management
@router.post("/gift-cards", response_model=GiftCard)
async def create_gift_card(
    gift_card_in: GiftCardCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Create a new gift card
    """
    return await crud_gift_card.create(db, obj_in=gift_card_in)


@router.put("/gift-cards/{gift_card_id}", response_model=GiftCard)
async def update_gift_card(
    gift_card_id: str,
    gift_card_in: GiftCardUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Update a gift card
    """
    gift_card = await crud_gift_card.get(db, id=gift_card_id)
    if not gift_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gift card not found"
        )
        
    return await crud_gift_card.update(db, db_obj=gift_card, obj_in=gift_card_in)


@router.get("/gift-cards/transactions", response_model=List[GiftCardTransaction])
async def get_all_gift_card_transactions(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Get all gift card transactions
    """
    return await crud_gift_card_transaction.get_multi(db, skip=skip, limit=limit)


@router.put("/gift-cards/transactions/{transaction_id}", response_model=GiftCardTransaction)
async def admin_update_gift_card_transaction(
    transaction_id: str,
    transaction_in: AdminGiftCardTransactionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Admin update for a gift card transaction
    """
    transaction = await crud_gift_card_transaction.get(db, id=transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
        
    return await crud_gift_card_transaction.update(
        db, db_obj=transaction, obj_in=transaction_in, admin_id=current_user.id
    )


# Admin Withdrawal Management
@router.get("/withdrawals", response_model=List[Withdrawal])
async def get_all_withdrawals(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Get all withdrawal requests
    """
    return await crud_withdrawal.get_multi(db, skip=skip, limit=limit)


@router.put("/withdrawals/{withdrawal_id}", response_model=Withdrawal)
async def admin_update_withdrawal(
    withdrawal_id: str,
    withdrawal_in: AdminWithdrawalUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Admin update for a withdrawal request
    """
    withdrawal = await crud_withdrawal.get(db, id=withdrawal_id)
    if not withdrawal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Withdrawal not found"
        )
        
    return await crud_withdrawal.update(
        db, db_obj=withdrawal, obj_in=withdrawal_in, admin_id=current_user.id
    )


# Admin Chat Support
@router.get("/chat/users", response_model=List[dict])
async def get_users_with_unread_messages(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Get users with unread messages and message counts
    """
    return await crud_chat_message.get_unread_counts(db, admin=True)


@router.get("/chat/messages/{user_id}", response_model=List[ChatMessage])
async def get_user_chat_messages(
    user_id: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Get chat messages for a specific user
    """
    user = await crud_user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    return await crud_chat_message.get_messages(
        db, user_id=user_id, skip=skip, limit=limit
    )


@router.post("/chat/messages", response_model=ChatMessage)
async def admin_send_message(
    message_in: AdminChatMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Admin sends a message to a user
    """
    user = await crud_user.get(db, id=message_in.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    message = await crud_chat_message.create_admin_message(
        db, 
        obj_in=ChatMessageCreate(
            message=message_in.message,
            attachment_url=message_in.attachment_url
        ),
        user_id=message_in.user_id,
        admin_id=current_user.id
    )
    
    # Send message to user if they are connected via websocket
    await ws_manager.send_to_user(
        str(message_in.user_id),
        {
            "admin_id": str(current_user.id),
            "message": message.message,
            "created_at": message.created_at.isoformat(),
            "message_id": str(message.id)
        }
    )
    
    return message


@router.post("/chat/messages/mark-as-read", response_model=dict)
async def admin_mark_messages_as_read(
    message_ids: List[str],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
) -> Any:
    """
    Admin marks messages as read
    """
    count = await crud_chat_message.mark_as_read(db, message_ids=message_ids)
    return {"marked_count": count}