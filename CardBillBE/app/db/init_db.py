# app/db/init_db.py

import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from app.db.base_class import Base
from app.core.config import settings
from app.crud.crud_user import user as crud_user
from app.schemas.user import UserCreate
from datetime import datetime
import uuid
from app.models import user

# Database engine and session setup
SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://cardbill_user:ZO0nFy94EJrIDNVqRoKCysG59vXKzIzc@dpg-d0dgqf1r0fns7397i7b0-a.oregon-postgres.render.com/cardbill"
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True, future=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Logging setup
logger = logging.getLogger(__name__)

# async def create_first_admin() -> None:
#     """
#     Create the first admin user if it doesn't exist
#     """
#     async with AsyncSessionLocal() as db:
#         admin = await crud_user.get_by_username(db, username=settings.FIRST_ADMIN_USERNAME)
#         if not admin:
#             user_in = UserCreate(
#                 username=settings.FIRST_ADMIN_USERNAME,
#                 password=settings.FIRST_ADMIN_PASSWORD,
#                 full_name="System Administrator",
#                 is_admin=True,
#             )
#             admin = await crud_user.create(db, obj_in=user_in)
#             logger.info(f"First admin user created: {settings.FIRST_ADMIN_USERNAME}")
#         else:
#             logger.info(f"Admin user already exists: {settings.FIRST_ADMIN_USERNAME}")

async def init_db():
    """
    Initialize the database by creating tables and creating the first admin user
    """
    # Step 1: Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Step 2: Create the first admin user after tables are created


    #  FIRST_ADMIN_USERNAME = admin
    # FIRST_ADMIN_PASSWORD = Adminpassword0