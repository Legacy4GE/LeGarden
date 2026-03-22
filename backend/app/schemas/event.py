from datetime import datetime
from pydantic import BaseModel


class EventBase(BaseModel):
    title: str
    description: str | None = None
    event_type: str
    start_time: datetime
    end_time: datetime | None = None
    plant_id: int | None = None


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    event_type: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    plant_id: int | None = None


class EventRead(EventBase):
    id: int

    class Config:
        from_attributes = True
