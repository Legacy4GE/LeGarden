from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import plants, events, profile, zones

app = FastAPI(
    title="LeGarden API",
    description="Backend API for the LeGarden garden growth tracker",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://192.168.1.168:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(plants.router, prefix="/api/plants", tags=["plants"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(zones.router, prefix="/api/zones", tags=["zones"])
