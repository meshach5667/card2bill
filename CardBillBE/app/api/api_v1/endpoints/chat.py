from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.chat import ChatMessage, ChatMessageCreate, ChatMessageUpdate
from app.crud.crud_chat import chat_message as crud_chat_message
from app.utils.websocket_manager import WebSocketManager

router = APIRouter()
ws_manager = WebSocketManager()


@router.get("/messages", response_model=List[ChatMessage])
async def get_chat_messages(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get user's chat messages
    """
    return await crud_chat_message.get_messages(
        db, user_id=current_user.id, skip=skip, limit=limit
    )


@router.post("/messages", response_model=ChatMessage)
async def create_chat_message(
    message_in: ChatMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Create a new chat message
    """
    message = await crud_chat_message.create_user_message(
        db, obj_in=message_in, user_id=current_user.id
    )
    
    # Notify any connected admin about the new message
    ws_manager.broadcast_to_admins({
        "user_id": str(current_user.id),
        "message": message.message,
        "created_at": message.created_at.isoformat(),
        "message_id": str(message.id)
    })
    
    return message


@router.post("/messages/mark-as-read", response_model=dict)
async def mark_messages_as_read(
    message_ids: List[str],
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Mark messages as read
    """
    count = await crud_chat_message.mark_as_read(db, message_ids=message_ids)
    return {"marked_count": count}


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket, 
    user_id: str, 
    token: str
):
    """
    WebSocket connection for real-time chat
    """
    # Authenticate using token
    # In a real implementation, validate token and get user
    # For this example, we'll just use the provided user_id
    
    await websocket.accept()
    ws_manager.add_connection(user_id, websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            # Process received messages if needed
            
            # Echo message back (for testing)
            await websocket.send_text(f"You sent: {data}")
    except WebSocketDisconnect:
        ws_manager.remove_connection(user_id)