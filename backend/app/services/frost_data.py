"""USDA hardiness zone frost date data and planting tip calculations.

Frost dates are approximate averages based on USDA zone data. Actual dates
vary by local microclimate, elevation, and year-to-year weather patterns.
"""

from datetime import date, timedelta

# ---------------------------------------------------------------------------
# USDA zone frost dates: (month, day) tuples for average last spring frost
# and first fall frost.  Sources: USDA Plant Hardiness Zone Map, National
# Gardening Association averages, and cooperative extension data.
# ---------------------------------------------------------------------------

ZONE_FROST_DATES: dict[str, dict[str, tuple[int, int]]] = {
    # Zone 1 – Interior Alaska, far-northern Canada
    "1a": {"last_spring_frost": (6, 15), "first_fall_frost": (8, 15)},
    "1b": {"last_spring_frost": (6, 10), "first_fall_frost": (8, 20)},
    # Zone 2 – Northern Alaska, northern interior Canada
    "2a": {"last_spring_frost": (6, 1), "first_fall_frost": (8, 25)},
    "2b": {"last_spring_frost": (5, 25), "first_fall_frost": (9, 1)},
    # Zone 3 – Northern Minnesota, Montana, parts of Alaska
    "3a": {"last_spring_frost": (5, 20), "first_fall_frost": (9, 5)},
    "3b": {"last_spring_frost": (5, 15), "first_fall_frost": (9, 10)},
    # Zone 4 – Northern Great Plains, northern New England
    "4a": {"last_spring_frost": (5, 10), "first_fall_frost": (9, 15)},
    "4b": {"last_spring_frost": (5, 5), "first_fall_frost": (9, 20)},
    # Zone 5 – Much of the Midwest, New England, parts of the Pacific NW
    "5a": {"last_spring_frost": (4, 30), "first_fall_frost": (9, 25)},
    "5b": {"last_spring_frost": (4, 25), "first_fall_frost": (9, 30)},
    # Zone 6 – Mid-Atlantic, parts of Midwest, Pacific NW valleys
    "6a": {"last_spring_frost": (4, 20), "first_fall_frost": (10, 5)},
    "6b": {"last_spring_frost": (4, 15), "first_fall_frost": (10, 10)},
    # Zone 7 – Mid-South, Virginia, parts of Pacific NW and Southwest
    "7a": {"last_spring_frost": (4, 10), "first_fall_frost": (10, 15)},
    "7b": {"last_spring_frost": (4, 1), "first_fall_frost": (10, 25)},
    # Zone 8 – Pacific NW coast, Deep South, parts of Texas
    "8a": {"last_spring_frost": (3, 25), "first_fall_frost": (10, 30)},
    "8b": {"last_spring_frost": (3, 15), "first_fall_frost": (11, 10)},
    # Zone 9 – Southern California, Gulf Coast, central Florida
    "9a": {"last_spring_frost": (3, 1), "first_fall_frost": (11, 20)},
    "9b": {"last_spring_frost": (2, 15), "first_fall_frost": (12, 1)},
    # Zone 10 – Southern Florida, coastal Southern California
    "10a": {"last_spring_frost": (1, 31), "first_fall_frost": (12, 10)},
    "10b": {"last_spring_frost": (1, 15), "first_fall_frost": (12, 20)},
    # Zone 11 – Hawaii, Key West, Puerto Rico
    "11a": {"last_spring_frost": (1, 1), "first_fall_frost": (12, 31)},
    "11b": {"last_spring_frost": (1, 1), "first_fall_frost": (12, 31)},
    # Zone 12 – Tropical Hawaii, Puerto Rico lowlands
    "12a": {"last_spring_frost": (1, 1), "first_fall_frost": (12, 31)},
    "12b": {"last_spring_frost": (1, 1), "first_fall_frost": (12, 31)},
    # Zone 13 – Tropical equatorial regions (rare in continental US)
    "13a": {"last_spring_frost": (1, 1), "first_fall_frost": (12, 31)},
    "13b": {"last_spring_frost": (1, 1), "first_fall_frost": (12, 31)},
}

# ---------------------------------------------------------------------------
# Plant frost/planting guide.
#
# Fields:
#   name – common name
#   start_indoors_weeks_before_last_frost – how many weeks before the last
#       spring frost to start seeds indoors (None if direct-sow only)
#   transplant_after_last_frost_weeks – weeks AFTER last frost to transplant
#       outdoors.  0 = at last frost date; negative = weeks BEFORE last frost
#       (for cold-hardy crops); positive = weeks after.
#   cold_hardy – can tolerate light frost (28-32 °F)
#   notes – brief growing tip
# ---------------------------------------------------------------------------

PLANT_FROST_GUIDE: list[dict] = [
    {
        "name": "Tomatoes",
        "start_indoors_weeks_before_last_frost": 6,
        "transplant_after_last_frost_weeks": 2,
        "cold_hardy": False,
        "notes": "Wait until nighttime temps are reliably above 50 °F. Harden off seedlings for 7-10 days before transplanting.",
    },
    {
        "name": "Peppers",
        "start_indoors_weeks_before_last_frost": 8,
        "transplant_after_last_frost_weeks": 2,
        "cold_hardy": False,
        "notes": "Peppers prefer warm soil (65 °F+). Start early indoors for a longer harvest window.",
    },
    {
        "name": "Cucumbers",
        "start_indoors_weeks_before_last_frost": 3,
        "transplant_after_last_frost_weeks": 2,
        "cold_hardy": False,
        "notes": "Direct sow or transplant after frost danger passes. Sensitive to root disturbance—use peat pots.",
    },
    {
        "name": "Squash",
        "start_indoors_weeks_before_last_frost": 3,
        "transplant_after_last_frost_weeks": 2,
        "cold_hardy": False,
        "notes": "Give plenty of space. Direct sowing works well in warm soil (60 °F+).",
    },
    {
        "name": "Zucchini",
        "start_indoors_weeks_before_last_frost": 3,
        "transplant_after_last_frost_weeks": 2,
        "cold_hardy": False,
        "notes": "Prolific producer—two or three plants are often plenty. Harvest at 6-8 inches for best flavor.",
    },
    {
        "name": "Lettuce",
        "start_indoors_weeks_before_last_frost": 4,
        "transplant_after_last_frost_weeks": -2,
        "cold_hardy": True,
        "notes": "Cool-season crop. Succession-sow every 2-3 weeks for continuous harvest. Bolts in heat.",
    },
    {
        "name": "Kale",
        "start_indoors_weeks_before_last_frost": 4,
        "transplant_after_last_frost_weeks": -3,
        "cold_hardy": True,
        "notes": "Extremely cold-hardy. Flavor improves after frost. Can overwinter in many zones.",
    },
    {
        "name": "Spinach",
        "start_indoors_weeks_before_last_frost": 4,
        "transplant_after_last_frost_weeks": -4,
        "cold_hardy": True,
        "notes": "Direct sow as soon as soil can be worked. Prefers cool weather; bolts quickly in heat.",
    },
    {
        "name": "Broccoli",
        "start_indoors_weeks_before_last_frost": 6,
        "transplant_after_last_frost_weeks": -2,
        "cold_hardy": True,
        "notes": "Cool-season crop. Harvest the central head before flowers open, then enjoy side shoots.",
    },
    {
        "name": "Cauliflower",
        "start_indoors_weeks_before_last_frost": 6,
        "transplant_after_last_frost_weeks": -2,
        "cold_hardy": True,
        "notes": "More finicky than broccoli—needs consistent temperatures. Blanch heads by tying outer leaves.",
    },
    {
        "name": "Carrots",
        "start_indoors_weeks_before_last_frost": None,
        "transplant_after_last_frost_weeks": -3,
        "cold_hardy": True,
        "notes": "Direct sow only—does not transplant. Prefers loose, rock-free soil. Thin to 2 inches apart.",
    },
    {
        "name": "Beans",
        "start_indoors_weeks_before_last_frost": None,
        "transplant_after_last_frost_weeks": 1,
        "cold_hardy": False,
        "notes": "Direct sow after frost when soil is 60 °F+. Inoculate with rhizobia for best nitrogen fixation.",
    },
    {
        "name": "Peas",
        "start_indoors_weeks_before_last_frost": None,
        "transplant_after_last_frost_weeks": -5,
        "cold_hardy": True,
        "notes": "Direct sow as early as soil can be worked. Provide a trellis. Peas fix their own nitrogen.",
    },
    {
        "name": "Corn",
        "start_indoors_weeks_before_last_frost": None,
        "transplant_after_last_frost_weeks": 2,
        "cold_hardy": False,
        "notes": "Direct sow in blocks (not rows) for good pollination. Needs warm soil (65 °F+).",
    },
    {
        "name": "Basil",
        "start_indoors_weeks_before_last_frost": 6,
        "transplant_after_last_frost_weeks": 2,
        "cold_hardy": False,
        "notes": "Very frost-sensitive. Pinch flower buds to prolong leaf production.",
    },
    {
        "name": "Cilantro",
        "start_indoors_weeks_before_last_frost": None,
        "transplant_after_last_frost_weeks": -2,
        "cold_hardy": True,
        "notes": "Direct sow. Bolts quickly in heat—succession-plant every 2-3 weeks. Prefers cool weather.",
    },
    {
        "name": "Parsley",
        "start_indoors_weeks_before_last_frost": 8,
        "transplant_after_last_frost_weeks": -2,
        "cold_hardy": True,
        "notes": "Slow to germinate (2-4 weeks). Soaking seeds overnight speeds sprouting. Biennial.",
    },
    {
        "name": "Eggplant",
        "start_indoors_weeks_before_last_frost": 8,
        "transplant_after_last_frost_weeks": 3,
        "cold_hardy": False,
        "notes": "Needs warm soil and air (70 °F+). One of the last crops to transplant out.",
    },
    {
        "name": "Watermelon",
        "start_indoors_weeks_before_last_frost": 3,
        "transplant_after_last_frost_weeks": 2,
        "cold_hardy": False,
        "notes": "Needs a long, warm season. Use black plastic mulch to warm soil in cooler zones.",
    },
    {
        "name": "Pumpkin",
        "start_indoors_weeks_before_last_frost": 3,
        "transplant_after_last_frost_weeks": 2,
        "cold_hardy": False,
        "notes": "Count back from your desired harvest date (90-120 days). Needs lots of space.",
    },
    {
        "name": "Onions",
        "start_indoors_weeks_before_last_frost": 10,
        "transplant_after_last_frost_weeks": -4,
        "cold_hardy": True,
        "notes": "Start indoors very early or buy transplants. Choose long-day, short-day, or day-neutral varieties based on latitude.",
    },
    {
        "name": "Garlic",
        "start_indoors_weeks_before_last_frost": None,
        "transplant_after_last_frost_weeks": None,
        "cold_hardy": True,
        "notes": "Plant cloves in fall, 4-6 weeks before ground freezes. Mulch heavily. Harvest when lower leaves brown.",
    },
]

# ---------------------------------------------------------------------------
# Tip generation
# ---------------------------------------------------------------------------


def _frost_date_for_year(month: int, day: int, year: int) -> date:
    """Build a date object, clamping to valid ranges."""
    # Handle zones 11-13 where frost dates are symbolic (Jan 1 / Dec 31).
    try:
        return date(year, month, day)
    except ValueError:
        # Leap year edge case for Feb 29, etc.
        return date(year, month, min(day, 28))


def _urgency_label(days_until: int) -> str:
    """Classify how urgent an action is based on days remaining."""
    if days_until < 0:
        return "overdue"
    if days_until <= 7:
        return "urgent"
    if days_until <= 21:
        return "upcoming"
    return "later"


def get_planting_tips(zone: str, current_date: date) -> list[dict]:
    """Return planting tips for the given USDA zone and current date.

    Each tip dict contains:
        plant_name  – the common name
        action      – what to do (e.g. "Start indoors", "Transplant outdoors")
        action_date – the target date for the action
        days_until  – days from *current_date* to *action_date* (negative = past)
        urgency     – "overdue" | "urgent" | "upcoming" | "later"
        detail      – human-readable description including the plant's notes
    """
    zone_lower = zone.strip().lower()
    frost_info = ZONE_FROST_DATES.get(zone_lower)
    if frost_info is None:
        raise ValueError(f"Unknown USDA zone: {zone!r}")

    year = current_date.year

    lsf = _frost_date_for_year(*frost_info["last_spring_frost"], year)
    fff = _frost_date_for_year(*frost_info["first_fall_frost"], year)

    tips: list[dict] = []

    for plant in PLANT_FROST_GUIDE:
        name = plant["name"]
        indoor_weeks = plant["start_indoors_weeks_before_last_frost"]
        transplant_weeks = plant["transplant_after_last_frost_weeks"]
        cold_hardy = plant["cold_hardy"]
        notes = plant["notes"]

        # --- Tip 1: Start seeds indoors -----------------------------------
        if indoor_weeks is not None:
            start_date = lsf - timedelta(weeks=indoor_weeks)
            days_until = (start_date - current_date).days
            tips.append({
                "plant_name": name,
                "action": "Start seeds indoors",
                "action_date": start_date.isoformat(),
                "days_until": days_until,
                "urgency": _urgency_label(days_until),
                "detail": (
                    f"Start {name.lower()} seeds indoors ~{indoor_weeks} weeks "
                    f"before last frost ({lsf.strftime('%b %d')}). {notes}"
                ),
            })

        # --- Tip 2: Transplant / direct sow outdoors ----------------------
        if transplant_weeks is not None:
            outdoor_date = lsf + timedelta(weeks=transplant_weeks)
            days_until = (outdoor_date - current_date).days

            if indoor_weeks is not None:
                action = "Transplant outdoors"
                detail_prefix = f"Transplant {name.lower()} seedlings outdoors"
            else:
                action = "Direct sow outdoors"
                detail_prefix = f"Direct sow {name.lower()} outdoors"

            if transplant_weeks < 0:
                timing_desc = f"{abs(transplant_weeks)} weeks before last frost"
            elif transplant_weeks == 0:
                timing_desc = "around the last frost date"
            else:
                timing_desc = f"{transplant_weeks} weeks after last frost"

            hardy_note = " (cold-hardy, tolerates light frost)" if cold_hardy else " (frost-sensitive, protect from cold)"

            tips.append({
                "plant_name": name,
                "action": action,
                "action_date": outdoor_date.isoformat(),
                "days_until": days_until,
                "urgency": _urgency_label(days_until),
                "detail": (
                    f"{detail_prefix} {timing_desc} "
                    f"({outdoor_date.strftime('%b %d')}){hardy_note}. {notes}"
                ),
            })
        elif plant["name"] == "Garlic":
            # Special case: garlic is planted in fall.
            garlic_plant_date = fff - timedelta(weeks=6)
            days_until = (garlic_plant_date - current_date).days
            tips.append({
                "plant_name": name,
                "action": "Plant cloves outdoors (fall planting)",
                "action_date": garlic_plant_date.isoformat(),
                "days_until": days_until,
                "urgency": _urgency_label(days_until),
                "detail": (
                    f"Plant garlic cloves outdoors ~6 weeks before the ground "
                    f"freezes (around {garlic_plant_date.strftime('%b %d')} in zone "
                    f"{zone_lower}). {notes}"
                ),
            })

    # Sort by urgency: overdue first (most negative days_until), then
    # ascending by days_until so nearest actions surface first.
    tips.sort(key=lambda t: t["days_until"])

    return tips
