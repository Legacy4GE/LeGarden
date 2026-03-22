"""Growth templates and helper functions for plant milestone tracking."""

from datetime import date, timedelta

GROWTH_TEMPLATES: dict[str, list[dict]] = {
    "tomato": [
        {"name": "Germination", "description": "Seeds sprout and first cotyledons emerge", "days_from_planting": 7},
        {"name": "First True Leaves", "description": "First set of true leaves develop above cotyledons", "days_from_planting": 21},
        {"name": "Transplant Ready", "description": "Seedlings are strong enough to transplant outdoors", "days_from_planting": 42},
        {"name": "First Flowers", "description": "First flower clusters appear on the plant", "days_from_planting": 60},
        {"name": "Fruit Set", "description": "Pollinated flowers begin developing into small green fruit", "days_from_planting": 70},
        {"name": "Fruit Ripening", "description": "Green fruit begins to change color and soften", "days_from_planting": 85},
        {"name": "First Harvest", "description": "First ripe fruit ready to pick", "days_from_planting": 95},
        {"name": "Peak Harvest", "description": "Plant is producing fruit at maximum rate", "days_from_planting": 110},
    ],
    "pepper": [
        {"name": "Germination", "description": "Seeds sprout and first cotyledons emerge", "days_from_planting": 10},
        {"name": "First True Leaves", "description": "First set of true leaves develop above cotyledons", "days_from_planting": 25},
        {"name": "Transplant Ready", "description": "Seedlings are sturdy enough for outdoor transplanting", "days_from_planting": 56},
        {"name": "First Buds", "description": "Small flower buds appear at branch junctions", "days_from_planting": 70},
        {"name": "First Flowers", "description": "Flower buds open into full blooms", "days_from_planting": 80},
        {"name": "Fruit Set", "description": "Pollinated flowers begin forming small peppers", "days_from_planting": 90},
        {"name": "Fruit Sizing", "description": "Peppers grow to near full size while still green", "days_from_planting": 105},
        {"name": "Color Change", "description": "Fruit transitions from green to final ripe color", "days_from_planting": 115},
        {"name": "First Harvest", "description": "First ripe peppers ready to pick", "days_from_planting": 120},
    ],
    "cucumber": [
        {"name": "Germination", "description": "Seeds sprout and cotyledons emerge", "days_from_planting": 5},
        {"name": "First True Leaves", "description": "True leaves appear above cotyledons", "days_from_planting": 14},
        {"name": "Vine Development", "description": "Vines begin to elongate and tendrils form", "days_from_planting": 28},
        {"name": "First Flowers", "description": "Yellow flowers appear on the vine", "days_from_planting": 35},
        {"name": "Fruit Set", "description": "Small cucumbers begin forming behind pollinated flowers", "days_from_planting": 42},
        {"name": "First Harvest", "description": "First cucumbers reach picking size", "days_from_planting": 55},
        {"name": "Peak Harvest", "description": "Plant produces cucumbers at maximum rate", "days_from_planting": 70},
    ],
    "lettuce": [
        {"name": "Germination", "description": "Seeds sprout and tiny seedlings emerge", "days_from_planting": 5},
        {"name": "First True Leaves", "description": "True leaves develop with characteristic shape", "days_from_planting": 14},
        {"name": "Rosette Formation", "description": "Leaves form a rosette pattern at the base", "days_from_planting": 25},
        {"name": "Head Formation", "description": "Leaves begin to cup inward forming a loose head", "days_from_planting": 35},
        {"name": "First Harvest", "description": "Outer leaves or full heads ready for harvest", "days_from_planting": 45},
        {"name": "Succession Harvest", "description": "Continue harvesting outer leaves as plant regrows", "days_from_planting": 55},
    ],
    "basil": [
        {"name": "Germination", "description": "Seeds sprout and cotyledons emerge", "days_from_planting": 7},
        {"name": "First True Leaves", "description": "First pair of aromatic true leaves appear", "days_from_planting": 18},
        {"name": "Bushing Out", "description": "Plant develops multiple stems and becomes bushy", "days_from_planting": 30},
        {"name": "First Harvest", "description": "Plant large enough for first leaf harvest", "days_from_planting": 40},
        {"name": "Full Production", "description": "Regular harvesting encourages continued leafy growth", "days_from_planting": 55},
        {"name": "Flower Buds", "description": "Flower spikes begin to form; pinch to extend harvest", "days_from_planting": 70},
    ],
}


def get_growth_template(plant_name: str) -> list[dict] | None:
    """Match a plant name against known growth templates.

    Checks if any template key is a substring of the lowercased plant name.
    Returns the template milestone list or None if no match is found.
    """
    lower_name = plant_name.lower()
    for key, template in GROWTH_TEMPLATES.items():
        if key in lower_name:
            return template
    return None


def compute_harvest_date(plant_name: str, date_planted: date) -> date | None:
    """Compute expected harvest date based on the first harvest milestone.

    Returns date_planted + days of the 'First Harvest' milestone,
    or None if no matching template is found.
    """
    template = get_growth_template(plant_name)
    if template is None:
        return None
    for milestone in template:
        if milestone["name"] == "First Harvest":
            return date_planted + timedelta(days=milestone["days_from_planting"])
    # Fallback: use the last milestone if no explicit "First Harvest"
    return date_planted + timedelta(days=template[-1]["days_from_planting"])
