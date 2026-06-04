# Research: Encounter Forge MVP

## Decision 1: Web stack and deployment alignment

- Decision: Use TypeScript across frontend and backend, with a CSR React frontend and Express API backend deployable to Render.
- Rationale: The feature requires browser-first interaction with authenticated APIs and later deployment via environment-based API URL configuration.
- Alternatives considered:
  - Next.js full-stack: Rejected for MVP to avoid adding SSR and framework complexity not required by current scope.
  - Single backend-rendered app: Rejected because spec explicitly targets client-side rendering.

## Decision 2: Session and authentication model

- Decision: Require authentication at app launch for protected routes, use expiring auth sessions with 24-hour inactivity timeout, and enforce encounter ownership server-side for every encounter endpoint.
- Rationale: Directly maps FR-004, FR-010, FR-021, and FR-022 and prevents IDOR-style access.
- Alternatives considered:
  - Frontend-only route protection: Rejected because authorization must be enforced in backend API.
  - Non-expiring sessions: Rejected because inactivity expiry is a hard requirement.

## Decision 3: Encounter status and monster minimums

- Decision: Introduce `status` with values `draft` and `ready`; drafts may contain zero monsters; ready encounters require at least one monster entry.
- Rationale: Supports user workflow to save partial work while preserving a meaningful readiness threshold.
- Alternatives considered:
  - Require at least one monster at all times: Rejected because user requested draft encounters.
  - No explicit status field: Rejected because status is now a confirmed business rule.

## Decision 4: Monster source and lookup behavior for MVP

- Decision: Use MongoDB-only monster catalog in MVP; provide area-filtered lookup with show-all fallback, typeahead search, and pagination.
- Rationale: Keeps scope constrained while still supporting responsive lookup behavior and future scalability.
- Alternatives considered:
  - External D&D API integration now: Rejected as explicitly out-of-scope for MVP.
  - No pagination/typeahead: Rejected due to usability and performance risk with larger catalogs.

## Decision 5: Encounter monster snapshot semantics

- Decision: Persist immutable monster snapshots on encounter detail (name, CR, quantity, AC, HP, speed, core stats, description, notes). Encounter list remains lightweight and omits full snapshot payload.
- Rationale: Preserves historical encounter intent even if catalog records change; reduces list response payload and improves responsiveness.
- Alternatives considered:
  - Live reference-only rendering from catalog: Rejected because historical encounters would drift as catalog data changes.
  - Full snapshot in list responses: Rejected due to unnecessary payload size and list performance cost.

## Decision 6: Duplicate monster handling

- Decision: Adding an already-selected monster increments the existing row quantity rather than creating duplicate rows.
- Rationale: Reduces editing friction and keeps encounter composition easier to read.
- Alternatives considered:
  - Allow duplicate rows: Rejected because it increases UI complexity and user error rate.

## Decision 7: Validation timing and guided form behavior

- Decision: Apply validation on section-step transition in the single-page ordered flow (Basics -> Party -> Monsters -> Review), with clear inline messages.
- Rationale: Matches clarified UX requirement while avoiding excessive interruption on every keystroke.
- Alternatives considered:
  - Validate only on final submit: Rejected because it delays feedback and hurts completion rates.
  - Validate on every keystroke: Rejected for noisier UX in structured forms.
