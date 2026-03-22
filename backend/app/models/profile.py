from sqlalchemy import Column, DateTime, Integer, String, func

from app.database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String(100), nullable=False)
    usda_zone = Column(String(10), nullable=False)
    zip_code = Column(String(10), nullable=True)
    timezone = Column(String(50), nullable=True, default="America/New_York")
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
