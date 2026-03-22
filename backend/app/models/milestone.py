from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class GrowthMilestone(Base):
    __tablename__ = "growth_milestones"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    days_from_planting = Column(Integer, nullable=False)
    completed_date = Column(Date, nullable=True)
    sort_order = Column(Integer, nullable=False, default=0)

    plant = relationship("Plant", back_populates="milestones")
