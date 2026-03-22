from zoneinfo import available_timezones

from fastapi import APIRouter

from app.services.frost_data import ZONE_FROST_DATES

router = APIRouter()


US_TIMEZONES = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Phoenix",
    "America/Anchorage",
    "Pacific/Honolulu",
    "America/Adak",
    "America/Boise",
    "America/Detroit",
    "America/Indiana/Indianapolis",
    "America/Kentucky/Louisville",
    "America/Juneau",
    "America/Nome",
]

TZ_LABELS = {
    "America/New_York": "Eastern Time (ET)",
    "America/Chicago": "Central Time (CT)",
    "America/Denver": "Mountain Time (MT)",
    "America/Los_Angeles": "Pacific Time (PT)",
    "America/Phoenix": "Arizona (no DST)",
    "America/Anchorage": "Alaska Time (AKT)",
    "Pacific/Honolulu": "Hawaii Time (HT)",
    "America/Adak": "Hawaii-Aleutian (HAT)",
    "America/Boise": "Mountain Time - Boise",
    "America/Detroit": "Eastern Time - Detroit",
    "America/Indiana/Indianapolis": "Eastern Time - Indiana",
    "America/Kentucky/Louisville": "Eastern Time - Louisville",
    "America/Juneau": "Alaska Time - Juneau",
    "America/Nome": "Alaska Time - Nome",
}


@router.get("/timezones")
def list_timezones():
    """Return US timezones for the profile timezone picker."""
    return [
        {"value": tz, "label": TZ_LABELS.get(tz, tz)}
        for tz in US_TIMEZONES
    ]


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
