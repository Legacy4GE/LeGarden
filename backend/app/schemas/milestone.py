from datetime import date
from pydantic import BaseModel


class MilestoneCreate(BaseModel):
    name: str
    description: str | None = None
    days_from_planting: int
    completed_date: date | None = None
    sort_order: int = 0


class MilestoneUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    days_from_planting: int | None = None
    completed_date: date | None = None
    sort_order: int | None = None


class MilestoneRead(BaseModel):
    id: int
    plant_id: int
    name: str
    description: str | None = None
    days_from_planting: int
    completed_date: date | None = None
    sort_order: int = 0

    class Config:
        from_attributes = True
