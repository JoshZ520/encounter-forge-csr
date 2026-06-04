# Implementation Plan: Encounter Forge MVP

**Branch**: `001-encounter-crud-auth` | **Date**: 2026-06-04 | **Spec**: `specs/001-encounter-crud-auth/spec.md`
**Input**: Feature specification from `/specs/001-encounter-crud-auth/spec.md`

## Summary

Deliver a client-side rendered encounter management experience for Dungeon Masters with account registration/login/logout, encounter ownership enforcement, and encounter CRUD. The technical approach uses a web application split (frontend + backend) with MongoDB persistence, immutable encounter monster snapshots, and guided form validation by section transition. MVP monster sourcing is MongoDB-only with area-filtered search, show-all fallback, typeahead, and pagination.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend and backend), Node.js 20 LTS  
**Primary Dependencies**: React (CSR UI), React Router, Express, Mongoose, bcrypt, JWT/session middleware, Zod/JOI-style request validation  
**Storage**: MongoDB (users, encounters, monster catalog)  
**Testing**: Vitest + React Testing Library (frontend), Jest/Supertest (backend), contract tests against OpenAPI  
**Target Platform**: Modern desktop/mobile browsers for frontend, Linux container on Render for backend  
**Project Type**: Web application (`frontend` + `backend`)  
**Performance Goals**: User-visible CRUD success/failure feedback within 2 seconds for 95% of actions (SC-003); monster lookup responses under 500ms p95 for paginated queries under typical MVP dataset  
**Constraints**: Require auth at app launch; 24-hour inactivity session expiry; strict owner isolation for encounter access; inline validation on section-step change; immutable monster snapshot once encounter version is saved  
**Scale/Scope**: MVP for a single role (Dungeon Master), dozens to low-thousands of encounters per user, monster catalog sized for paginated search, no external monster API integration in MVP

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Code Quality First: PASS. Plan keeps clear domain boundaries (auth, encounters, monster catalog) and avoids speculative features excluded by scope.
- Test-Driven Verification: PASS. Plan includes unit/integration/contract coverage for authentication, ownership authorization, validation boundaries, and CRUD/snapshot behavior.
- User Experience Consistency: PASS. Guided single-page flow with ordered sections and consistent inline validation messaging is preserved from specification.
- Performance Budgets Are Mandatory: PASS. Response time target is defined from SC-003 with explicit lookup p95 target for monster search.
- Scope Discipline and Simplicity: PASS. Monster data source remains MongoDB-only in MVP; external API integration explicitly deferred.

## Project Structure

### Documentation (this feature)

```text
specs/001-encounter-crud-auth/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   ├── auth/
│   │   ├── encounters/
│   │   └── monsters/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   └── lib/
└── tests/
  ├── contract/
  ├── integration/
  └── unit/

frontend/
├── src/
│   ├── pages/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   └── encounters/
│   ├── services/
│   └── lib/
└── tests/
  ├── integration/
  └── unit/
```

**Structure Decision**: Use a frontend/backend web split to align with CSR frontend plus Render-hosted backend deployment. The feature will introduce encounter domain modeling and contract-first API design under this structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | N/A        | N/A                                  |

## Post-Design Constitution Check

- Code Quality First: PASS. Data model separates user, encounter, and monster catalog concerns while keeping encounter snapshots explicit and auditable.
- Test-Driven Verification: PASS. Design artifacts define boundary conditions and contract expectations suitable for pre-implementation tests.
- User Experience Consistency: PASS. Contracts and model enforce guided flow semantics (draft support, section-step validation semantics, collapsible detail payload).
- Performance Budgets Are Mandatory: PASS. Paginated/typeahead catalog endpoint and list/detail split prevent oversized payloads and support SC-003 latency target.
- Scope Discipline and Simplicity: PASS. No API integration for external monster services in MVP; manual monster entry and MongoDB catalog satisfy requirements.
