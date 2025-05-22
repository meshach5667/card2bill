import os
import uuid
from fastapi import UploadFile
import aiofiles

# Directory for file uploads
UPLOAD_DIR = "uploads"

# Ensure upload directories exist
os.makedirs(f"{UPLOAD_DIR}/profile_pictures", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/gift_cards", exist_ok=True)


async def save_profile_picture(file: UploadFile, user_id: str) -> str:
    """
    Save user profile picture and return URL
    """
    # Generate unique filename with original extension
    filename = f"{user_id}_{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
    file_path = f"{UPLOAD_DIR}/profile_pictures/{filename}"
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Return relative URL
    return f"/uploads/profile_pictures/{filename}"


async def save_gift_card_image(file: UploadFile, user_id: str) -> str:
    """
    Save gift card image and return URL
    """
    # Generate unique filename with original extension
    filename = f"{user_id}_{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
    file_path = f"{UPLOAD_DIR}/gift_cards/{filename}"
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Return relative URL
    return f"/uploads/gift_cards/{filename}"