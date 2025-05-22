from typing import Dict, List, Any
from fastapi import WebSocket
import json
import logging

logger = logging.getLogger(__name__)


class WebSocketManager:
    """
    Manager for WebSocket connections
    """
    def __init__(self):
        # User ID to WebSocket mapping
        self.active_connections: Dict[str, WebSocket] = {}
        # List of admin user IDs
        self.admin_connections: List[str] = []
        
    def add_connection(self, user_id: str, websocket: WebSocket, is_admin: bool = False):
        """
        Add a new WebSocket connection
        """
        self.active_connections[user_id] = websocket
        if is_admin:
            self.admin_connections.append(user_id)
        logger.info(f"WebSocket connection added for user {user_id}")
        
    def remove_connection(self, user_id: str):
        """
        Remove a WebSocket connection
        """
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if user_id in self.admin_connections:
            self.admin_connections.remove(user_id)
        logger.info(f"WebSocket connection removed for user {user_id}")
    
    async def send_to_user(self, user_id: str, message: Any):
        """
        Send a message to a specific user
        """
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            await websocket.send_text(json.dumps(message))
            logger.info(f"Message sent to user {user_id}")
            
    async def broadcast(self, message: Any):
        """
        Broadcast a message to all connected clients
        """
        for user_id, websocket in self.active_connections.items():
            await websocket.send_text(json.dumps(message))
        logger.info(f"Message broadcasted to {len(self.active_connections)} users")
            
    async def broadcast_to_admins(self, message: Any):
        """
        Broadcast a message to all connected admin clients
        """
        for user_id in self.admin_connections:
            if user_id in self.active_connections:
                await self.active_connections[user_id].send_text(json.dumps(message))
        logger.info(f"Message broadcasted to {len(self.admin_connections)} admins")