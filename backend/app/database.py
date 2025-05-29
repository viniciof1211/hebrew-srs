import os
import time
from sqlalchemy import MetaData, create_engine
from sqlalchemy.ext.declarative import declarative_base

# Use env var
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@db:5432/vocab_trainer')

# Sync engine for metadata.create_all and health checks
engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)

# Shared metadata for Table definitions
metadata = MetaData()

# Declarative Base (if using ORM)
Base = declarative_base(metadata=metadata)