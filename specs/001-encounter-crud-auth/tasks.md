# Tasks: Encounter Forge MVP

**Input**: Design documents from `/specs/001-encounter-crud-auth/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Include contract and integration tests because the specification and constitution require verifiable behavior for auth, ownership, CRUD, validation, and UX/performance-sensitive flows.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize frontend and backend workspaces and baseline tooling.

- [ ] T001 Initialize backend project dependencies and scripts in backend/package.json
- [ ] T002 Initialize frontend project dependencies and scripts in frontend/package.json
- [ ] T003 [P] Add backend environment template variables in backend/.env.example
- [ ] T004 [P] Add frontend environment template variables in frontend/.env.example
- [ ] T005 [P] Configure lint/format settings for both apps in backend/.eslintrc.cjs
- [ ] T006 Create shared frontend API client wrapper in frontend/src/services/apiClient.ts
- [ ] T007 Create backend app bootstrap and HTTP server entrypoints in backend/src/app.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core infrastructure that blocks all user stories until complete.

**CRITICAL**: No user story implementation starts before this phase is done.

- [ ] T008 Configure MongoDB connection and startup wiring in backend/src/lib/mongoose.ts
- [ ] T009 [P] Implement auth/session middleware with inactivity checks in backend/src/middleware/auth.ts
- [ ] T010 [P] Implement centralized API error handling middleware in backend/src/middleware/errorHandler.ts
- [ ] T011 Create reusable request validation helpers in backend/src/lib/validation.ts
- [ ] T012 Create shared enum/value constants from contract in backend/src/models/enums.ts
- [ ] T013 Register API route modules and middleware pipeline in backend/src/api/index.ts
- [ ] T014 Add OpenAPI contract harness baseline in backend/tests/contract/openapi.contract.test.ts

**Checkpoint**: Foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - Secure Account Access (Priority: P1) MVP

**Goal**: Users can register, log in, log out, and are blocked from protected features when unauthenticated.

**Independent Test**: Register a new account, log in, log out, confirm protected routes require authentication, and verify invalid credentials fail with clear errors.

### Tests for User Story 1

- [ ] T015 [P] [US1] Add auth contract tests for register/login/logout in backend/tests/contract/auth.contract.test.ts
- [ ] T016 [P] [US1] Add auth integration tests including session expiry behavior in backend/tests/integration/auth.session.integration.test.ts

### Implementation for User Story 1

- [ ] T017 [P] [US1] Create user schema/model with normalized email and timestamps in backend/src/models/user.model.ts
- [ ] T018 [US1] Implement auth service for registration, login, logout, and token/session handling in backend/src/services/auth.service.ts
- [ ] T019 [US1] Implement auth route handlers and input validation in backend/src/api/auth/auth.routes.ts
- [ ] T020 [US1] Implement login/register pages and protected-route gate in frontend/src/pages/LoginPage.tsx
- [ ] T021 [US1] Implement frontend auth state/session lifecycle handling in frontend/src/features/auth/authStore.ts
- [ ] T022 [US1] Implement auth form error/success messaging in frontend/src/features/auth/AuthForm.tsx

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Create And Manage Encounters (Priority: P2)

**Goal**: Authenticated users can create, view, edit, and delete only their own encounters in a guided form flow.

**Independent Test**: Log in, create encounter, verify list/detail, edit, delete, and confirm ownership restrictions.

### Tests for User Story 2

- [ ] T023 [P] [US2] Add encounter CRUD contract tests for /encounters endpoints in backend/tests/contract/encounters.contract.test.ts
- [ ] T024 [P] [US2] Add encounter integration tests for ownership and CRUD lifecycle in backend/tests/integration/encounters.crud.integration.test.ts

### Implementation for User Story 2

- [ ] T025 [P] [US2] Create encounter schema/model with status, difficulty, and targetCR fields in backend/src/models/encounter.model.ts
- [ ] T026 [US2] Implement encounter CRUD service with owner scoping in backend/src/services/encounter.service.ts
- [ ] T027 [US2] Implement encounter API routes for list/create/detail/update/delete in backend/src/api/encounters/encounters.routes.ts
- [ ] T028 [US2] Implement guided single-page form sections and step-transition validation in frontend/src/features/encounters/EncounterFormWizard.tsx
- [ ] T029 [P] [US2] Implement encounter list and detail pages in frontend/src/pages/EncounterListPage.tsx
- [ ] T030 [US2] Implement frontend encounter API integration and success/failure confirmations in frontend/src/features/encounters/encounterApi.ts
- [ ] T031 [US2] Implement frontend validation schema for required fields, bounds, and enums in frontend/src/features/encounters/encounterValidation.ts
- [ ] T032 [US2] Implement draft/ready status controls and transition guards in frontend/src/features/encounters/EncounterStatusControls.tsx

**Checkpoint**: User Stories 1 and 2 are independently functional.

---

## Phase 5: User Story 3 - Build Detailed Monster Lineups (Priority: P3)

**Goal**: Users can search/add/edit/remove monster lineups with snapshot persistence behavior.

**Independent Test**: Create/edit encounter monsters (catalog and manual), verify duplicate selection increments quantity, and confirm saved snapshots remain stable.

### Tests for User Story 3

- [ ] T033 [P] [US3] Add monster lookup contract tests for filtering, fallback, and pagination in backend/tests/contract/monsters.contract.test.ts
- [ ] T034 [P] [US3] Add integration tests for manual entries, duplicate merge, and immutable snapshots in backend/tests/integration/monsters.snapshot.integration.test.ts

### Implementation for User Story 3

- [ ] T035 [P] [US3] Create monster catalog schema/model for global lookup in backend/src/models/monsterCatalog.model.ts
- [ ] T036 [US3] Implement monster catalog search service with area filter and show-all fallback in backend/src/services/monsterCatalog.service.ts
- [ ] T037 [US3] Implement monster lookup API endpoint with typeahead and pagination in backend/src/api/monsters/monsters.routes.ts
- [ ] T038 [US3] Implement monster picker UI with area filter, show-all toggle, search, and paging in frontend/src/features/encounters/MonsterPicker.tsx
- [ ] T039 [US3] Implement encounter monster editor with add/edit/remove and quantity increment behavior in frontend/src/features/encounters/EncounterMonsterEditor.tsx
- [ ] T040 [US3] Implement collapsible monster snapshot card UI in frontend/src/features/encounters/MonsterSnapshotCard.tsx
- [ ] T041 [US3] Implement encounter snapshot mapping for catalog and manual monsters in frontend/src/features/encounters/snapshotMapper.ts

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify quality gates across documentation, performance, and UX consistency.

- [ ] T042 [P] Add quickstart execution verification notes in specs/001-encounter-crud-auth/quickstart.md
- [ ] T043 [P] Add monster lookup performance regression test for p95 target in backend/tests/integration/monsters.performance.integration.test.ts
- [ ] T044 Run guided-form UX consistency pass and finalize interaction copy in frontend/src/features/encounters/EncounterFormWizard.tsx
- [ ] T045 Update OpenAPI examples and error-case details in specs/001-encounter-crud-auth/contracts/openapi.yaml
- [ ] T046 Document implementation outcomes and constraints review in specs/001-encounter-crud-auth/plan.md
- [ ] T047 Add timed workflow test for SC-001 and SC-002 thresholds in frontend/tests/integration/workflow.timing.integration.test.ts
- [ ] T048 Add CRUD confirmation latency checks for SC-003 in frontend/tests/integration/crud.feedback.performance.test.ts
- [ ] T049 Add usability acceptance runbook and pass-rate capture for SC-004 in specs/001-encounter-crud-auth/checklists/usability.md
- [ ] T050 Add unauthorized ownership acceptance test report workflow for SC-005 in specs/001-encounter-crud-auth/checklists/security-acceptance.md
- [ ] T051 Add explicit MVP scope guard checklist for FR-015 exclusions in specs/001-encounter-crud-auth/checklists/scope-guard.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): Start immediately.
- Foundational (Phase 2): Depends on Phase 1 completion and blocks all user stories.
- User Story phases (Phases 3-5): Depend on Phase 2 completion.
- Polish (Phase 6): Depends on completion of target user stories.

### User Story Dependencies

- US1 (P1): Starts after foundational phase; no dependency on other stories.
- US2 (P2): Starts after foundational phase; depends on auth from US1 for protected actions.
- US3 (P3): Starts after foundational phase; can be developed and tested independently using seeded encounter fixtures and API-level setup without waiting on US2 frontend completion.

### Within Each User Story

- Contract/integration tests first.
- Models before services.
- Services before routes/API integration.
- Backend contract compliance before frontend behavior wiring.

---

## Parallel Execution Examples

### User Story 1

- Run T015 and T016 in parallel (different test files).
- Run T017 in parallel with test authoring tasks while service implementation has not started.

### User Story 2

- Run T023 and T024 in parallel.
- Run T025 and T029 in parallel after foundational phase because they target backend model and frontend pages separately.

### User Story 3

- Run T033 and T034 in parallel.
- Run T035 and T038 in parallel after contract tests are drafted, then converge on T039-T041 for behavior integration.

---

## Implementation Strategy

### MVP First (US1)

1. Complete Setup and Foundational phases.
2. Deliver User Story 1 end-to-end.
3. Validate US1 independently before moving forward.

### Incremental Delivery

1. Add US2 after US1 stabilization.
2. Add US3 after encounter CRUD is stable.
3. Finish with Polish tasks for quality/performance/UX checks, measurable success-criteria validation, and MVP scope guards.

### Suggested MVP Scope

- MVP for first release demo: User Story 1 only.
- Expanded MVP+: User Stories 1 and 2.
- Full planned scope: User Stories 1, 2, and 3 plus Phase 6 polish.
