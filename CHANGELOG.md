
# Change Log

## [v0.4.0] - 2026-05-02

### Added
- Interactive map view using Mapbox GL, displaying task and training pins by GPS coordinates.
- `TaskModal` and `TrainingModal` components showing details when a pin is selected.
- RSVP system: users can sign up for tasks directly from the task modal; RSVP state is persisted in Parse.
- `rsvpService` to handle RSVP create/delete operations.
- Full real-time messaging system: send and receive messages, live updates via Parse Live Queries.
- Conversation list view showing all active message threads.
- Tapping the avatar in the chat header navigates to that user's profile.
- Profile page showing user info, contacts, and navigation to messaging.
- `ContactList` component listing all contacts with links to individual contact pages.
- Map-level search bar with dropdown results and fly-to navigation.
- Global search across tasks, trainings, contacts, and users.
- `tasksService` and `trainingsService` for fetching and transforming Parse data.
- `seedContacts` utility and `SeedPage` component for populating test data in development.
- Latitude/Longitude fields added to Tasks and Trainings in Back4App.

### Changed
- Profile page fully redesigned with updated layout and user info display.
- Task modal expanded to show full task details including contact info, certificate aid, and RSVP controls.
- `Contact` page updated to display richer contact details.
- `searchService` refactored to query all entity types in parallel.
- `AuthService` updated to support firstName/lastName fields on registration.
- Routing updated to include `/profile`, `/profile/:id`, `/contacts`, `/messages`, and `/chat/:id`.

### Removed
- Deleted unused `Task`, `TaskList`, `Training`, and `TrainingList` components.
- Removed unread message notification badge; read/unread state was not persisting correctly to Back4App.

---

## [v0.3.0] - 2026-03-27

### Added
- User authentication (register and login) using Parse.
- `ProtectedRoute` component to restrict access to authenticated users.
- `AuthRoute` component to prevent logged-in users from accessing auth pages.
- Dedicated authentication pages for register and login.

### Changed
- Updated routing to include authentication paths.
- Modified navigation flow to redirect users based on authentication state.

### Fixed
- Fixed navigation issues where unauthorized users could access protected routes.
- Fixed routing behavior to properly handle redirects for both authenticated and unauthenticated users.
