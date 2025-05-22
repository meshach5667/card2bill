from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat import ChatMessage
from app.schemas.chat import ChatMessageCreate, ChatMessageUpdate


class CRUDChatMessage:
    async def get(self, db: AsyncSession, id: UUID) -> Optional[ChatMessage]:
        """
        Get a chat message by ID
        """
        result = await db.execute(select(ChatMessage).where(ChatMessage.id == id))
        return result.scalars().first()
        
    async def get_messages(
        self, db: AsyncSession, *, user_id: UUID, skip: int = 0, limit: int = 100
    ) -> List[ChatMessage]:
        """
        Get chat messages for a user
        """
        query = select(ChatMessage).where(
            ChatMessage.user_id == user_id
        ).order_by(
            ChatMessage.created_at.asc()
        ).offset(skip).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    async def get_unread_counts(
        self, db: AsyncSession, *, admin: bool = False
    ) -> List[dict]:
        """
        Get unread message counts grouped by user
        For admin: count of unread messages from users
        For users: not applicable (would be implemented client-side)
        """
        if admin:
            # This would be a complex query to get counts of unread messages by user
            # For simplicity in this example, we'll return a placeholder
            # In a real implementation, this would use a more efficient SQL query
            # with group by and aggregation
            return []
        return []
        
    async def create_user_message(
        self, db: AsyncSession, *, obj_in: ChatMessageCreate, user_id: UUID
    ) -> ChatMessage:
        """
        Create a new chat message from a user
        """
        db_obj = ChatMessage(
            user_id=user_id,
            message=obj_in.message,
            attachment_url=obj_in.attachment_url,
            is_from_admin=False,
            is_read=False
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def create_admin_message(
        self, db: AsyncSession, *, obj_in: ChatMessageCreate, user_id: UUID, admin_id: UUID
    ) -> ChatMessage:
        """
        Create a new chat message from an admin to a user
        """
        db_obj = ChatMessage(
            user_id=user_id,
            admin_id=admin_id,
            message=obj_in.message,
            attachment_url=obj_in.attachment_url,
            is_from_admin=True,
            is_read=False
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def mark_as_read(
        self, db: AsyncSession, *, message_ids: List[UUID]
    ) -> int:
        """
        Mark messages as read
        Returns number of messages updated
        """
        # In a real implementation, this would use a bulk update operation
        count = 0
        for msg_id in message_ids:
            result = await db.execute(select(ChatMessage).where(ChatMessage.id == msg_id))
            msg = result.scalars().first()
            if msg and not msg.is_read:
                msg.is_read = True
                db.add(msg)
                count += 1
                
        if count > 0:
            await db.commit()
            
        return count


chat_message = CRUDChatMessage()