from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel


class ChatMessageBase(BaseModel):
    message: str
    attachment_url: Optional[str] = None


class ChatMessageCreate(ChatMessageBase):
    pass


class ChatMessageUpdate(BaseModel):
    is_read: Optional[bool] = None


class ChatMessage(ChatMessageBase):
    id: UUID
    user_id: UUID
    admin_id: Optional[UUID] = None
    is_from_admin: bool
    is_read: bool
    created_at: datetime

    class Config:
        orm_mode = True


# Admin sending message
class AdminChatMessageCreate(ChatMessageBase):
    user_id: UUID