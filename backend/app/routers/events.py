from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.event import GardenEvent
from app.schemas.event import EventCreate, EventRead, EventUpdate

router = APIRouter()


@router.get("/", response_model=list[EventRead])
def list_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(GardenEvent).offset(skip).limit(limit).all()


@router.post("/", response_model=EventRead, status_code=201)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = GardenEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.get("/{event_id}", response_model=EventRead)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(GardenEvent).filter(GardenEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.patch("/{event_id}", response_model=EventRead)
def update_event(event_id: int, event_update: EventUpdate, db: Session = Depends(get_db)):
    event = db.query(GardenEvent).filter(GardenEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    for field, value in event_update.model_dump(exclude_unset=True).items():
        setattr(event, field, value)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(GardenEvent).filter(GardenEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
