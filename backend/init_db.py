"""Initialize the database tables."""
from app.database import engine, Base
from app.models import Plant, GardenEvent  # noqa: F401

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")
