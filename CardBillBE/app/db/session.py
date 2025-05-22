from typing import Generator, AsyncGenerator, Any

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import asyncpg
from app.core.config import settings

# Create async engine for PostgreSQL
engine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URI, 
    echo=True,
    future=True
)



# Create async session
AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def get_db() -> AsyncGenerator[Any, None]:
    """
    Dependency for getting async db session
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

