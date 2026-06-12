# Usability Acceptance Runbook

## Workflow Coverage

- [x] Log in and reach the encounter workspace without guidance.
- [x] Create a new encounter through the guided Basics -> Party -> Monsters -> Review flow.
- [x] Add a monster lineup using the catalog picker and manual entry path.
- [x] Save, reopen, edit, and delete an encounter without losing context.

## Pass-Rate Capture

Record the testing run outcome here before signoff:

| Scenario                  | Pass | Notes                                          |
| ------------------------- | ---: | ---------------------------------------------- |
| Login to workspace        |  Yes | Protected route loads `/encounters` after auth |
| Guided encounter creation |  Yes | Step transitions validate before save          |
| Monster lineup editing    |  Yes | Catalog and manual entry remain supported      |
| Encounter delete flow     |  Yes | Confirmation feedback appears immediately      |

Target pass rate: 90% or higher.
