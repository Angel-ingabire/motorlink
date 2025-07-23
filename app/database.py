"""
Async database connection setup for MotorLink FastAPI application using SQLAlchemy async.
Provides database engine, session factory, and base model configuration.
"""

import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:root@localhost:5000/motorlink")

engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)
Base = declarative_base()

async def get_db():
    """Dependency that provides database sessions."""
    async with AsyncSessionLocal() as db:
        yield db
