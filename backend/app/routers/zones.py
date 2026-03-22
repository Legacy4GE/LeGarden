from fastapi import APIRouter

from app.services.frost_data import ZONE_FROST_DATES

router = APIRouter()


@router.get("/")
def list_zones():
    """Return all USDA hardiness zones with their approximate frost dates.

    Useful for populating a zone-picker UI.
    """
    zones = []
    for zone_code, dates in ZONE_FROST_DATES.items():
        lsf_month, lsf_day = dates["last_spring_frost"]
        fff_month, fff_day = dates["first_fall_frost"]
        zones.append({
            "zone": zone_code,
            "last_spring_frost": f"{lsf_month:02d}-{lsf_day:02d}",
            "first_fall_frost": f"{fff_month:02d}-{fff_day:02d}",
        })
    return zones
