# Encounter Forge Runbook

## 1) First-Time Setup

From repo root:

```powershell
npm install
Set-Location backend
npm install
Set-Location ../frontend
npm install
```

## 2) Environment Setup

Create `backend/.env` from `backend/.env.example` and set real values.

Minimum required backend values:

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN=http://localhost:5173`

Create `frontend/.env` with:

- `VITE_API_BASE_URL=http://localhost:3000`

## 3) Run Locally (Two Terminals)

Terminal A (backend):

```powershell
Set-Location backend
npm run dev
```

Terminal B (frontend):

```powershell
Set-Location frontend
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`).

## 4) Build Checks (Pre-Submission)

Backend:

```powershell
Set-Location backend
npm run build
```

Frontend:

```powershell
Set-Location frontend
npm run build
```

## 5) Quick Smoke Test

1. Register a user
2. Login
3. Create encounter
4. Edit encounter
5. Open detail page
6. Delete encounter

## 6) Most Common Issues

### A) Frontend cannot reach API

Symptoms:

- Network errors
- Failed auth/encounter requests

Checks:

1. Is backend running?
2. Is `VITE_API_BASE_URL` correct in `frontend/.env`?
3. Is `CORS_ORIGIN` set to frontend URL in `backend/.env`?

### B) Backend starts but DB fails

Symptoms:

- Startup crash around DB connect

Checks:

1. `MONGODB_URI` is valid and reachable
2. IP access/network rules allow your machine

### C) Running wrong command in wrong folder

Symptoms:

- "Missing script" or command failures

Fix:

- Run frontend commands inside `frontend/`
- Run backend commands inside `backend/`

## 7) Deployment Shortcut (If Needed)

- Frontend: Deno Deploy static site
- Backend: Render/Railway Node service
- DB: MongoDB Atlas
- Set `VITE_API_BASE_URL` to deployed backend URL
- Set backend `CORS_ORIGIN` to frontend deployed URL

## 8) Recovery Plan If Things Feel Messy

1. Stop all terminals
2. Run backend build
3. Run frontend build
4. Start backend dev
5. Start frontend dev
6. Run the smoke test list above

If build passes and smoke test passes, the project is in a stable state.
