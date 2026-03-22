"""Seed the database with sample plants, milestones, and overdue events."""

from datetime import date, datetime, timedelta, timezone

from app.database import SessionLocal
from app.models.plant import Plant
from app.models.milestone import GrowthMilestone
from app.models.event import GardenEvent
from app.services.growth_data import get_growth_template, compute_harvest_date


def seed():
    db = SessionLocal()
    try:
        # --- Roma Tomato ---
        tomato = db.query(Plant).filter(Plant.name == "Roma Tomato").first()
        if not tomato:
            tomato = Plant(
                name="Roma Tomato",
                species="Solanum lycopersicum",
                variety="Roma VF",
                date_planted=date(2026, 3, 1),
                location="Raised bed A",
                status="growing",
                notes="Started indoors under grow lights",
            )
            tomato.expected_harvest_date = compute_harvest_date(tomato.name, tomato.date_planted)
            db.add(tomato)
            db.commit()
            db.refresh(tomato)

            # Apply growth template
            template = get_growth_template(tomato.name)
            if template:
                for idx, item in enumerate(template):
                    ms = GrowthMilestone(
                        plant_id=tomato.id,
                        name=item["name"],
                        description=item["description"],
                        days_from_planting=item["days_from_planting"],
                        sort_order=idx,
                    )
                    # Mark first 2 milestones as completed
                    if idx < 2:
                        ms.completed_date = tomato.date_planted + timedelta(days=item["days_from_planting"])
                    db.add(ms)
                db.commit()

            # Overdue event: "Water Roma Tomato" - 2 days ago
            water_event = GardenEvent(
                title="Water Roma Tomato",
                event_type="water",
                start_time=datetime.now(timezone.utc) - timedelta(days=2),
                end_time=None,
                plant_id=tomato.id,
            )
            db.add(water_event)
            db.commit()
            print("Roma Tomato created with milestones and overdue event.")
        else:
            print("Roma Tomato already exists, skipping.")

        # --- Bell Pepper ---
        pepper = db.query(Plant).filter(Plant.name == "Bell Pepper").first()
        if not pepper:
            pepper = Plant(
                name="Bell Pepper",
                species="Capsicum annuum",
                variety="California Wonder",
                date_planted=date(2026, 2, 15),
                location="Raised bed B",
                status="growing",
                notes="Started indoors, needs warm soil for transplant",
            )
            pepper.expected_harvest_date = compute_harvest_date(pepper.name, pepper.date_planted)
            db.add(pepper)
            db.commit()
            db.refresh(pepper)

            # Apply growth template
            template = get_growth_template(pepper.name)
            if template:
                for idx, item in enumerate(template):
                    ms = GrowthMilestone(
                        plant_id=pepper.id,
                        name=item["name"],
                        description=item["description"],
                        days_from_planting=item["days_from_planting"],
                        sort_order=idx,
                    )
                    # Mark first 2 milestones as completed
                    if idx < 2:
                        ms.completed_date = pepper.date_planted + timedelta(days=item["days_from_planting"])
                    db.add(ms)
                db.commit()

            # Overdue event: "Fertilize Bell Pepper" - 3 days ago
            fertilize_event = GardenEvent(
                title="Fertilize Bell Pepper",
                event_type="fertilize",
                start_time=datetime.now(timezone.utc) - timedelta(days=3),
                end_time=None,
                plant_id=pepper.id,
            )
            db.add(fertilize_event)
            db.commit()
            print("Bell Pepper created with milestones and overdue event.")
        else:
            print("Bell Pepper already exists, skipping.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
    print("Seed data applied successfully.")
