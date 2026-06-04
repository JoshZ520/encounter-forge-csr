# Quickstart: Encounter Forge MVP

## 1. Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)
- Render-compatible backend runtime (for deployment stage)

## 2. Environment Variables

Backend `.env`:

```env
PORT=3000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
SESSION_INACTIVITY_HOURS=24
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 3. Implement API from Contract

Use `contracts/openapi.yaml` as source of truth for:

- Auth endpoints (`/auth/register`, `/auth/login`, `/auth/logout`)
- Encounter CRUD (`/encounters`, `/encounters/{encounterId}`)
- Monster catalog lookup (`/monsters` with area/search/pagination)

## 4. Implement Data Shapes

Model entities according to `data-model.md`:

- `User`
- `MonsterCatalogItem`
- `Encounter`
- Embedded `EncounterMonsterSnapshot`

Critical behavior:

- Store both `difficulty` and `targetCR`.
- Allow `draft` encounters with empty monsters.
- Require at least one monster when `status=ready`.
- Persist immutable snapshot fields on save.
- Merge duplicate selected monsters by incrementing quantity.

## 5. Validation and UX Rules

- Validate on section-step transition in guided flow:
  - Basics -> Party -> Monsters -> Review
- Enforce required ranges/enums exactly as specified.
- Keep monster descriptions collapsible in UI.
- Implement typeahead + paginated monster lookup.

## 6. Minimum Test Matrix

- Authentication:
  - Register success/failure
  - Login success/failure
  - Logout and protected route denial
  - Session expiry after inactivity
- Authorization:
  - Owner can access own encounter
  - Non-owner gets forbidden/not found on other user encounter
- Encounter lifecycle:
  - Create draft with zero monsters
  - Transition draft to ready with valid monster list
  - Update and delete owned encounter
- Monster behavior:
  - Area-filtered lookup + show-all fallback
  - Manual monster entry when needed
  - Duplicate selection increments quantity
  - Snapshot immutability after catalog edits

## 7. Next Command

After confirming these artifacts, run `/speckit.tasks` to generate implementation tasks from this plan.
