# Feature Specification: Encounter Forge MVP

**Feature Branch**: `001-encounter-crud-auth`  
**Created**: 2026-06-04  
**Status**: Draft  
**Input**: User description: "I want to build Encounter Forge, a client-side rendered web application for Dungeon Masters to create and manage Dungeons & Dragons combat encounters. Users should be able to register, log in, log out, and manage their own saved encounters. Each encounter should include an encounter name, party level, party size, environment, difficulty, notes, and a list of monsters. Each monster entry should include a monster name, quantity, challenge rating, and optional notes. The MVP should focus on authentication and simple encounter CRUD: users can create, view, edit, and delete their own encounters. Advanced features like pulling monster data from a D&D API, random encounter generation, or initiative tracking should be treated as stretch goals only. The app should be designed so it can be deployed later, with the backend hosted on Render and the frontend able to connect to the deployed API through environment variables."

## Clarifications

### Session 2026-06-04

- Q: What data validation strictness should MVP use for party and monster setup fields? -> A: Option B - Constrained MVP validation: party level 1-20, party size 1-10, monster quantity 1-99, difficulty enum = Easy/Medium/Hard/Deadly, environment enum = Dungeon/Forest/Urban/Wilderness/Underdark/Other.
- Q: What encounter setup interaction pattern should MVP use for intuitiveness? -> A: Option A - Single-page guided form with ordered sections Basics -> Party -> Monsters -> Review and inline validation; detailed field-level validation guidelines will be refined in a follow-up clarification.
- Q: What session behavior should MVP use? -> A: Option B - Require login on app launch, expire session after inactivity (24 hours), and require re-login after expiry.
- Q: How should monster challenge rating be represented in MVP? -> A: Option B - Restrict challenge rating to predefined D&D CR values: 0, 1/8, 1/4, 1/2, and whole numbers 1 through 30.

## User Scenarios & Testing _(mandatory)_

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.

  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Secure Account Access (Priority: P1)

As a Dungeon Master, I can register, log in, and log out so that my saved encounters are private and tied to my account.

**Why this priority**: Without account access and identity, encounter ownership and private data management are not possible.

**Independent Test**: Can be fully tested by creating a new account, logging in with valid credentials, logging out, and confirming protected encounter areas require authentication.

**Acceptance Scenarios**:

1. **Given** a visitor without an account, **When** they submit valid registration details, **Then** a new account is created and they can access their authenticated area.
2. **Given** a registered user, **When** they submit valid login credentials, **Then** they are authenticated and directed to their encounter workspace.
3. **Given** an authenticated user, **When** they choose to log out, **Then** their session ends and protected pages are no longer accessible without logging in again.
4. **Given** a user enters invalid login credentials, **When** they attempt to log in, **Then** access is denied and a clear error message is shown.

---

### User Story 2 - Create And Manage Encounters (Priority: P2)

As an authenticated Dungeon Master, I can create, view, edit, and delete my encounters so I can plan combat sessions effectively.

**Why this priority**: Encounter CRUD is the core product value after authentication is in place.

**Independent Test**: Can be fully tested by logging in, creating a new encounter with required fields, viewing it, editing details, and deleting it.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they create an encounter with required fields, **Then** the encounter is saved and appears in their encounter list.
2. **Given** an authenticated user with saved encounters, **When** they open an encounter, **Then** they can view all stored encounter fields and monster entries.
3. **Given** an authenticated user, **When** they update encounter details and save, **Then** the updated values are shown on subsequent views.
4. **Given** an authenticated user, **When** they delete an encounter, **Then** it is removed from their encounter list and no longer accessible.
5. **Given** an authenticated user creating or editing an encounter, **When** they use the setup form, **Then** they are guided through ordered sections (Basics, Party, Monsters, Review) on a single page with inline validation feedback.

---

### User Story 3 - Build Detailed Monster Lineups (Priority: P3)

As an authenticated Dungeon Master, I can add and maintain a list of monsters within each encounter, including quantity and challenge rating, so encounters match my party composition.

**Why this priority**: Monster lineups are essential to encounter planning quality but can be delivered after baseline encounter CRUD.

**Independent Test**: Can be tested by creating an encounter, adding multiple monsters with required attributes, editing and removing monster entries, and confirming persisted values.

**Acceptance Scenarios**:

1. **Given** an authenticated user editing an encounter, **When** they add a monster entry with name, quantity, and challenge rating, **Then** the monster entry is saved with the encounter.
2. **Given** an encounter with existing monsters, **When** the user edits quantity or notes for a monster entry, **Then** the modified monster details are retained.
3. **Given** an encounter with multiple monsters, **When** the user removes one monster entry and saves, **Then** only the remaining monster entries are shown.

---

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when a user attempts to access encounter URLs while not authenticated? -> user is rerouted to the login page
- How does the system handle duplicate encounter names for the same user? -> Encounters have unique ids that are used for them
- What happens when party level, party size, or monster quantity is outside allowed bounds? The system rejects save and shows field-specific validation errors.
- How does the system handle encounters with an empty monster list at creation time? -> warns the user the encounter will be saved as a draft
- What happens when a user tries to access or modify an encounter owned by another user? -> Access is blocked by ownership checks; the API returns unauthorized/not-found behavior and the UI shows an access-denied message.
- How does the system handle session expiration during an active edit? The user is returned to login and must re-authenticate before continuing.

## Requirements _(mandatory)_

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST allow new users to register an account using email and password credentials.
- **FR-002**: System MUST authenticate registered users through a login flow and deny access for invalid credentials.
- **FR-003**: System MUST provide a logout action that terminates the authenticated session.
- **FR-004**: System MUST require authentication for all encounter creation, viewing, editing, and deletion actions.
- **FR-005**: System MUST let authenticated users create encounters with these fields: encounter name, party level, party size, environment, difficulty, notes, and monster list.
- **FR-006**: System MUST let authenticated users view a list of only their own saved encounters.
- **FR-007**: System MUST let authenticated users view full details of one of their saved encounters.
- **FR-008**: System MUST let authenticated users edit and save updates to their own encounters.
- **FR-009**: System MUST let authenticated users delete their own encounters.
- **FR-010**: System MUST enforce encounter ownership so users cannot view, edit, or delete encounters created by other users.
- **FR-011**: System MUST support monster entries within encounters with fields: monster name, quantity, challenge rating, and optional notes.
- **FR-012**: System MUST let users add, edit, and remove monster entries while creating or editing an encounter.
- **FR-013**: System MUST validate required fields and show clear user-facing validation messages when input is missing or invalid.
- **FR-016**: System MUST enforce these numeric bounds: party level 1-20, party size 1-10, and monster quantity 1-99.
- **FR-017**: System MUST restrict difficulty to one of: Easy, Medium, Hard, Deadly.
- **FR-018**: System MUST restrict environment to one of: Dungeon, Forest, Urban, Wilderness, Underdark, Other.
- **FR-023**: System MUST restrict monster challenge rating to one of these values: 0, 1/8, 1/4, 1/2, or an integer from 1 to 30.
- **FR-019**: System MUST provide encounter create/edit as a single-page guided form with ordered sections: Basics, Party, Monsters, Review.
- **FR-020**: System MUST present inline validation feedback within the guided form sections before save submission succeeds.
- **FR-021**: System MUST require authentication on app launch when no active session exists.
- **FR-022**: System MUST expire authenticated sessions after 24 hours of inactivity and require the user to log in again.
- **FR-014**: System MUST preserve encounter and monster data between user sessions until the user deletes it.
- **FR-015**: System MUST define these as out of scope for MVP: external monster API integration, random encounter generation, and initiative tracking.

### Assumptions

- MVP supports a single authenticated user role: Dungeon Master.
- Encounter name uniqueness is not required; users may save multiple encounters with the same name.
- Notes fields for encounters and monsters are optional free-text entries.
- Environment is selected from: Dungeon, Forest, Urban, Wilderness, Underdark, Other.
- Difficulty is selected from: Easy, Medium, Hard, Deadly.
- Monster challenge rating is selected from D&D CR values: 0, 1/8, 1/4, 1/2, 1-30.
- A saved encounter may contain zero or more monster entries.

### Key Entities _(include if feature involves data)_

- **User Account**: Represents a Dungeon Master identity with authentication credentials and ownership of encounters.
- **Encounter**: Represents a planned combat setup with name, party level, party size, environment, difficulty, optional notes, and an owning user.
- **Encounter Monster Entry**: Represents a monster included in a specific encounter with monster name, quantity, challenge rating, and optional notes.

## Success Criteria _(mandatory)_

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable. For user-facing work, include at least one criterion that
  captures experience consistency or usability, and add a performance target when responsiveness matters.
-->

### Measurable Outcomes

- **SC-001**: 95% of new users can register and reach their authenticated encounter workspace in under 2 minutes on first attempt.
- **SC-002**: 95% of authenticated users can create a complete encounter (including at least one monster entry) in under 3 minutes.
- **SC-003**: 95% of encounter create, update, and delete actions show user-visible confirmation of success or failure within 2 seconds.
- **SC-004**: In usability testing, at least 90% of Dungeon Masters successfully complete the full workflow (log in, create encounter, edit encounter, delete encounter, log out) without assistance.
- **SC-005**: 100% of unauthorized access attempts to another user's encounter are blocked during acceptance testing.

## Dependencies

- A backend service is available to persist users and encounters and can be deployed independently.
- The frontend can be configured with environment-specific backend connection values for local and deployed environments.

## Out Of Scope

- Automatic monster data import from third-party Dungeons & Dragons APIs.
- Random encounter generation.
- Initiative tracking and turn-order management.
