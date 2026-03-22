from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.profile import UserProfile
from app.schemas.profile import ProfileCreate, ProfileRead, ProfileUpdate
from app.services.frost_data import ZONE_FROST_DATES, get_planting_tips

router = APIRouter()


@router.get("/", response_model=ProfileRead)
def get_profile(db: Session = Depends(get_db)):
    """Return the current user profile (first profile found), or 404."""
    profile = db.query(UserProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="No profile found. Create one first.")
    return profile


@router.post("/", response_model=ProfileRead, status_code=201)
def create_profile(payload: ProfileCreate, db: Session = Depends(get_db)):
    """Create a new user profile.

    Only one profile is expected at a time. If one already exists, return 409.
    """
    existing = db.query(UserProfile).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="A profile already exists. Use PATCH to update it.",
        )

    zone = payload.usda_zone.lower()
    if zone not in ZONE_FROST_DATES:
        raise HTTPException(status_code=422, detail=f"Unknown USDA zone: {payload.usda_zone!r}")

    db_profile = UserProfile(**payload.model_dump())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile


@router.patch("/", response_model=ProfileRead)
def update_profile(payload: ProfileUpdate, db: Session = Depends(get_db)):
    """Update the existing user profile."""
    profile = db.query(UserProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="No profile found. Create one first.")

    update_data = payload.model_dump(exclude_unset=True)

    if "usda_zone" in update_data:
        zone = update_data["usda_zone"].lower()
        if zone not in ZONE_FROST_DATES:
            raise HTTPException(status_code=422, detail=f"Unknown USDA zone: {update_data['usda_zone']!r}")

    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile


@router.get("/tips")
def get_frost_tips(db: Session = Depends(get_db)):
    """Return frost-aware planting tips based on the stored profile zone."""
    profile = db.query(UserProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="No profile found. Create one first.")

    if not profile.usda_zone:
        raise HTTPException(status_code=400, detail="Profile does not have a USDA zone set.")

    try:
        tips = get_planting_tips(profile.usda_zone, date.today())
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    return {
        "zone": profile.usda_zone,
        "date": date.today().isoformat(),
        "tips": tips,
    }
