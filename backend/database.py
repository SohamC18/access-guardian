from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import Base


# Replace with your actual PostgreSQL credentials
# Format: postgresql://user:password@localhost:port/db_name
DATABASE_URL = "sqlite:///./obsidian.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # This creates the tables based on your models.py
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()