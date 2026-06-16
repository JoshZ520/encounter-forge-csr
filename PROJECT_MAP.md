# Encounter Forge Project Map

## What This Project Is

Encounter Forge is a full-stack app for creating and managing RPG encounters.

- Frontend: React + Vite + TypeScript (CSR app)
- Backend: Express + TypeScript + MongoDB (Mongoose)
- Auth: JWT bearer token

## Top-Level Folders

- `frontend/`: React app, pages, encounter UI components
- `backend/`: API routes, models, middleware, database connection
- `specs/`: feature specs, plans, and checklists

## Runtime Flow (High-Level)

1. User interacts with frontend pages.
2. Frontend sends API requests using Axios client.
3. Backend validates/authenticates request and performs DB operations.
4. Backend returns JSON response.
5. Frontend updates UI state.

## Frontend Key Areas

- `frontend/src/pages/`
  - `Login.tsx`, `Register.tsx`
  - `EncounterListPage.tsx`
  - `EncounterDetailPage.tsx`
  - `EncounterEditorPage.tsx`
- `frontend/src/features/encounters/`
  - Wizard/editor components, API helpers, validation logic
- `frontend/src/services/apiClient.ts`
  - Axios client and API base URL

## Frontend Styling (Current)

- Shared encounter component styles:
  - `frontend/src/features/encounters/EncounterComponents.css`
- Shared encounter page styles:
  - `frontend/src/pages/EncounterPages.css`
- Shared auth page styles:
  - `frontend/src/pages/AuthPages.css`

## Backend Key Areas

- `backend/src/app.ts`
  - Express app startup, CORS, JSON parsing, `/health`, router wiring
- `backend/src/api/`
  - Route modules for auth, encounters, monsters
- `backend/src/models/`
  - Mongoose schemas/models
- `backend/src/middleware/`
  - Auth/validation/error middleware
- `backend/src/lib/mongoose.ts`
  - Database connection setup

## Environment Variables

Backend (from `.env` in `backend/`):

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `SESSION_INACTIVITY_HOURS`
- `CORS_ORIGIN`

Frontend (from `.env` in `frontend/`):

- `VITE_API_BASE_URL`

## One-Sentence Mental Model

Frontend pages call backend endpoints through one Axios client, and backend endpoints enforce auth + validation before reading/writing MongoDB.
