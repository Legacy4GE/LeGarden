from sqlalchemy import Column, Integer, String, Date, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    species = Column(String(200))
    variety = Column(String(200))
    date_planted = Column(Date)
    location = Column(String(200))
    notes = Column(Text)

    events = relationship("GardenEvent", back_populates="plant", cascade="all, delete-orphan")
