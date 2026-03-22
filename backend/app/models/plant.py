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
    status = Column(String(50), default="planted")
    expected_harvest_date = Column(Date, nullable=True)

    events = relationship("GardenEvent", back_populates="plant", cascade="all, delete-orphan")
    milestones = relationship("GrowthMilestone", back_populates="plant", cascade="all, delete-orphan", order_by="GrowthMilestone.sort_order")
