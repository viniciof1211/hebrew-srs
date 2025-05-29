# backend/app/models.py

import asyncio
import uuid
import os
import time
from sqlalchemy import Table, Column, String, Integer, DateTime, Float, Text, UnicodeText
from datetime import datetime

from .database import metadata, engine, DATABASE_URL
from databases import Database

# Use the same DATABASE_URL
DB_URL = os.getenv('DATABASE_URL', DATABASE_URL)
db = Database(DB_URL)

# Define flashcards table
flashcards = Table(
    'flashcards', metadata,
    Column('id', String, primary_key=True, default=lambda: str(uuid.uuid4())),
    Column('hebrew_word', String, nullable=False),
    Column('translation', String, nullable=False),
    Column('context_sentence', Text),
    Column('svg_data', Text),
    Column('image_url', String),
    Column('next_review', DateTime, default=lambda: datetime.utcnow()),
    Column('interval_days', Integer, default=1),
    Column('ease_factor', Float, default=2.5),
    Column('repetitions', Integer, default=0),
)

async def init_db(retries: int = 10, delay: float = 2.0):
    # First, wait until the sync engine can connect and create tables
    for attempt in range(1, retries + 1):
        try:
            conn = engine.connect()
            metadata.create_all(bind=engine)
            conn.close()
            print(f"✅ Tables created on attempt {attempt}")
            break
        except Exception as e:
            print(f"⚠️ Table creation attempt {attempt}/{retries} failed: {e}")
            if attempt == retries:
                raise RuntimeError("Could not create tables after multiple attempts")
            time.sleep(delay)

    # Next, retry the async Database connect
    for attempt in range(1, retries + 1):
        try:
            await db.connect()
            print(f"✅ Database connected on attempt {attempt}")
            return
        except Exception as e:
            print(f"⚠️ Database connect attempt {attempt}/{retries} failed: {e}")
            if attempt == retries:  
                raise RuntimeError("Could not connect to Postgres after multiple attempts")
            await asyncio.sleep(delay)

async def shutdown_db():
    await db.disconnect()
