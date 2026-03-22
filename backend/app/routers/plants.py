from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.plant import Plant
from app.models.event import GardenEvent
from app.models.milestone import GrowthMilestone
from app.schemas.plant import PlantCreate, PlantRead, PlantUpdate, PlantDetailRead
from app.schemas.milestone import MilestoneCreate, MilestoneRead, MilestoneUpdate
from app.schemas.event import EventRead
from app.services.growth_data import get_growth_template, compute_harvest_date

router = APIRouter()


@router.get("/", response_model=list[PlantRead])
def list_plants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Plant).offset(skip).limit(limit).all()


@router.post("/", response_model=PlantRead, status_code=201)
def create_plant(plant: PlantCreate, db: Session = Depends(get_db)):
    db_plant = Plant(**plant.model_dump())
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    return db_plant


@router.get("/active", response_model=list[PlantRead])
def list_active_plants(db: Session = Depends(get_db)):
    """Return plants with status in ('planted', 'growing', 'harvesting')."""
    return (
        db.query(Plant)
        .filter(Plant.status.in_(["planted", "growing", "harvesting"]))
        .all()
    )


@router.get("/{plant_id}/detail")
def get_plant_detail(plant_id: int, db: Session = Depends(get_db)):
    """Return plant with milestones and overdue events."""
    plant = (
        db.query(Plant)
        .options(joinedload(Plant.milestones))
        .filter(Plant.id == plant_id)
        .first()
    )
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    # Find overdue events: start_time in the past and end_time is null
    now = datetime.now(timezone.utc)
    overdue_events = (
        db.query(GardenEvent)
        .filter(
            GardenEvent.plant_id == plant_id,
            GardenEvent.start_time < now,
            GardenEvent.end_time.is_(None),
        )
        .all()
    )

    plant_data = PlantDetailRead.model_validate(plant)
    overdue_data = [EventRead.model_validate(e) for e in overdue_events]

    return {
        "plant": plant_data,
        "milestones": plant_data.milestones,
        "overdue_events": overdue_data,
    }


@router.post("/{plant_id}/milestones", response_model=MilestoneRead, status_code=201)
def create_milestone(plant_id: int, milestone: MilestoneCreate, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    db_milestone = GrowthMilestone(plant_id=plant_id, **milestone.model_dump())
    db.add(db_milestone)
    db.commit()
    db.refresh(db_milestone)
    return db_milestone


@router.patch("/{plant_id}/milestones/{milestone_id}", response_model=MilestoneRead)
def update_milestone(
    plant_id: int,
    milestone_id: int,
    milestone_update: MilestoneUpdate,
    db: Session = Depends(get_db),
):
    milestone = (
        db.query(GrowthMilestone)
        .filter(GrowthMilestone.id == milestone_id, GrowthMilestone.plant_id == plant_id)
        .first()
    )
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")

    for field, value in milestone_update.model_dump(exclude_unset=True).items():
        setattr(milestone, field, value)
    db.commit()
    db.refresh(milestone)
    return milestone


@router.post("/{plant_id}/apply-template")
def apply_growth_template(plant_id: int, db: Session = Depends(get_db)):
    """Look up plant name in growth templates, create milestones, set expected_harvest_date."""
    plant = (
        db.query(Plant)
        .options(joinedload(Plant.milestones))
        .filter(Plant.id == plant_id)
        .first()
    )
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")

    template = get_growth_template(plant.name)
    if template is None:
        raise HTTPException(status_code=404, detail="No growth template found for this plant")

    # Create milestones from template
    for idx, item in enumerate(template):
        ms = GrowthMilestone(
            plant_id=plant.id,
            name=item["name"],
            description=item["description"],
            days_from_planting=item["days_from_planting"],
            sort_order=idx,
        )
        db.add(ms)

    # Set expected harvest date
    if plant.date_planted:
        plant.expected_harvest_date = compute_harvest_date(plant.name, plant.date_planted)

    db.commit()
    db.refresh(plant)

    plant_data = PlantDetailRead.model_validate(plant)
    return {
        "plant": plant_data,
        "milestones": plant_data.milestones,
    }


@router.get("/{plant_id}", response_model=PlantRead)
def get_plant(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant


@router.patch("/{plant_id}", response_model=PlantRead)
def update_plant(plant_id: int, plant_update: PlantUpdate, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    for field, value in plant_update.model_dump(exclude_unset=True).items():
        setattr(plant, field, value)
    db.commit()
    db.refresh(plant)
    return plant


@router.delete("/{plant_id}", status_code=204)
def delete_plant(plant_id: int, db: Session = Depends(get_db)):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    db.delete(plant)
    db.commit()
