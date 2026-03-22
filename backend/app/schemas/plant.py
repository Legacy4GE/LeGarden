from datetime import date
from pydantic import BaseModel


class PlantBase(BaseModel):
    name: str
    species: str | None = None
    variety: str | None = None
    date_planted: date | None = None
    location: str | None = None
    notes: str | None = None


class PlantCreate(PlantBase):
    pass


class PlantUpdate(BaseModel):
    name: str | None = None
    species: str | None = None
    variety: str | None = None
    date_planted: date | None = None
    location: str | None = None
    notes: str | None = None


class PlantRead(PlantBase):
    id: int

    class Config:
        from_attributes = True
