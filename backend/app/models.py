from sqlalchemy import (
    MetaData, Table, Column, String, Integer, Float, DateTime, Text
)
from databases import Database

DATABASE_URL = 'postgresql://postgres:postgres@db:5432/vocab_trainer'
metadata = MetaData()

flashcards = Table(
    'flashcards', metadata,
    Column('id', String, primary_key=True),
    Column('hebrew_word', String, nullable=False),
    Column('translation', String, nullable=False),
    Column('context_sentence', Text, nullable=True),
    Column('svg_data', Text, nullable=True),  # serialized SVG or Mermaid
    Column('image_url', String, nullable=True),
    Column('next_review', DateTime, nullable=False),
    Column('interval_days', Integer, default=1),
    Column('ease_factor', Float, default=2.5),
    Column('repetitions', Integer, default=0),
)

db = Database(DATABASE_URL)

async def init_db():
    await db.connect()
    from sqlalchemy import create_engine
    engine = create_engine(DATABASE_URL)
    metadata.create_all(engine)
