# Data Model: Encounter Forge MVP

## Enums

- Difficulty: `Easy | Medium | Hard | Deadly`
- Environment: `Dungeon | Forest | Urban | Wilderness | Underdark | Other`
- EncounterStatus: `draft | ready`
- ChallengeRating: `0 | 1/8 | 1/4 | 1/2 | 1..30`

## Entity: User

- Description: Authenticated Dungeon Master identity and encounter owner.
- Fields:
  - `id` (ObjectId/UUID, required, immutable)
  - `email` (string, required, unique, normalized lowercase)
  - `passwordHash` (string, required)
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)
  - `lastActivityAt` (datetime, required, used for inactivity timeout)
- Validation:
  - Email must be valid format and unique.
  - Password policy defined by auth service (MVP minimum length + hashing).

## Entity: MonsterCatalogItem

- Description: Global MongoDB-backed monster reference used by lookup UI.
- Fields:
  - `id` (ObjectId/UUID, required)
  - `name` (string, required)
  - `cr` (ChallengeRating, required)
  - `environments` (Environment[], required, non-empty)
  - `ac` (number, optional)
  - `hp` (number, optional)
  - `speed` (string, optional)
  - `coreStats` (object, optional)
    - `str` (number, optional)
    - `dex` (number, optional)
    - `con` (number, optional)
    - `int` (number, optional)
    - `wis` (number, optional)
    - `cha` (number, optional)
  - `description` (string, optional)
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)
- Validation:
  - `cr` must be from allowed CR enum values.
  - Search endpoint supports pagination and case-insensitive typeahead.

## Entity: Encounter

- Description: User-owned encounter record containing party setup and embedded monster snapshots.
- Fields:
  - `id` (ObjectId/UUID, required)
  - `ownerUserId` (foreign key -> User.id, required, indexed)
  - `title` (string, required)
  - `partySize` (integer, required, min 1, max 10)
  - `partyLevel` (integer, required, min 1, max 20, average level)
  - `environment` (Environment, required)
  - `difficulty` (Difficulty, required)
  - `targetCR` (ChallengeRating, required)
  - `notes` (string, optional)
  - `status` (EncounterStatus, required)
  - `monsters` (EncounterMonsterSnapshot[], required, may be empty only when `status=draft`)
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)
- Validation:
  - `title` must be non-empty after trim.
  - `status=ready` requires at least one monster entry.
  - Duplicate encounter titles are allowed per user.
  - Ownership is mandatory for read/update/delete operations.

## Entity: EncounterMonsterSnapshot (embedded in Encounter)

- Description: Immutable snapshot of monster data captured when encounter is saved.
- Fields:
  - `id` (ObjectId/UUID, required)
  - `sourceMonsterId` (foreign key -> MonsterCatalogItem.id, optional for manual entries)
  - `isManual` (boolean, required)
  - `name` (string, required)
  - `quantity` (integer, required, default 1, min 1, max 99)
  - `cr` (ChallengeRating, required)
  - `ac` (number|null, optional)
  - `hp` (number|null, optional)
  - `speed` (string|null, optional)
  - `coreStats` (object, optional)
    - `str` (number|null)
    - `dex` (number|null)
    - `con` (number|null)
    - `int` (number|null)
    - `wis` (number|null)
    - `cha` (number|null)
  - `description` (string, optional)
  - `notes` (string, optional, user editable)
- Validation:
  - Duplicate selected catalog monsters merge by `sourceMonsterId` and increment quantity.
  - Manual entries require name + CR + quantity.

## Relationships

- User `1 -> many` Encounter
- Encounter `1 -> many` EncounterMonsterSnapshot (embedded)
- EncounterMonsterSnapshot `many -> 0..1` MonsterCatalogItem via `sourceMonsterId`

## State Transitions

- Encounter:
  - `draft -> ready` allowed only if all required encounter fields pass validation and `monsters.length >= 1`.
  - `ready -> draft` allowed when user edits encounter and intentionally saves as draft.
- Session:
  - Authenticated session invalidates after 24 hours of inactivity and requires re-authentication.

## Derived/API View Models

- Encounter List Item (lightweight):
  - `id`, `title`, `partySize`, `partyLevel`, `environment`, `difficulty`, `targetCR`, `status`, `updatedAt`
- Encounter Detail:
  - Full Encounter payload including monster snapshots.
