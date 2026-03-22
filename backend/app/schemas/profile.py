from datetime import datetime

from pydantic import BaseModel, Field


class ProfileCreate(BaseModel):
    display_name: str = Field(..., min_length=1, max_length=100)
    usda_zone: str = Field(..., min_length=2, max_length=10, pattern=r"^(1[0-3]|[1-9])[ab]$")
    zip_code: str | None = Field(None, max_length=10)
    timezone: str | None = Field("America/New_York", max_length=50)


class ProfileUpdate(BaseModel):
    display_name: str | None = Field(None, min_length=1, max_length=100)
    usda_zone: str | None = Field(None, min_length=2, max_length=10, pattern=r"^(1[0-3]|[1-9])[ab]$")
    zip_code: str | None = Field(None, max_length=10)
    timezone: str | None = Field(None, max_length=50)


class ProfileRead(BaseModel):
    id: int
    display_name: str
    usda_zone: str
    zip_code: str | None = None
    timezone: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
