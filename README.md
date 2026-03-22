# LeGarden

A web-first calendar and scheduler webapp for tracking garden growth.

## Tech Stack

- **Frontend:** React 19 + Vite, Tailwind CSS, FullCalendar, React Router
- **Backend:** Python FastAPI, SQLAlchemy, SQLite
- **API Docs:** Auto-generated at `/docs` (Swagger UI)

## Getting Started

### Backend

```bash
cd backend
source .venv/bin/activate
python init_db.py
uvicorn app.main:app --reload
```

The API runs at http://localhost:8000. Interactive docs at http://localhost:8000/docs.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173 and proxies API requests to the backend.

## Project Structure

```
LeGarden/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── config.py         # Settings
│   │   ├── database.py       # DB engine & session
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routers/          # API route handlers
│   │   └── services/         # Business logic
│   ├── requirements.txt
│   └── init_db.py
├── frontend/
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/       # Reusable components
│   │   └── pages/            # Page components
│   └── package.json
└── README.md
```
