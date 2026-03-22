from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class GardenEvent(Base):
    __tablename__ = "garden_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    event_type = Column(String(50), nullable=False)  # water, fertilize, prune, harvest, etc.
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=True)

    plant = relationship("Plant", back_populates="events")
