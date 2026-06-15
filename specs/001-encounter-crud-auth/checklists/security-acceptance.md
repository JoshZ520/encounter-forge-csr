# Security Acceptance Workflow

## Required Checks

- [x] Verify unauthenticated users are redirected away from protected pages.
- [x] Verify one user cannot access another user's encounter detail, edit, or delete actions.
- [x] Verify expired sessions force a return to login.
- [x] Verify API responses do not expose another user's encounter record.

## Report Template

| Check                    | Result | Evidence                                                 |
| ------------------------ | ------ | -------------------------------------------------------- |
| Protected route redirect | Pass   | `ProtectedRoute` sends unauthenticated users to `/login` |
| Ownership enforcement    | Pass   | Encounter detail API returns 404 for non-owner           |
| Session expiry           | Pass   | Auth session must be restored after inactivity timeout   |
| Data exposure            | Pass   | Encounter list only returns the active user's records    |
