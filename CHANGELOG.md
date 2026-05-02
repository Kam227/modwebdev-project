
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [v0.7.0] - 2026-05-01

### Removed
- Deleted unused `Task`, `TaskList`, `Training`, and `TrainingList` components (dead code — map fetches data directly via services).
- Removed unread message notification badge; read/unread state was not persisting correctly to Back4App.

### Changed
- Cleaned up `MessagingService` by removing `getUnreadCount` and `markConversationRead`.

### Added
- Tapping the avatar in the chat header navigates to that user's profile.

---

## [v0.6.0] - 2026-04-24

### Added
- Full real-time messaging system: send and receive messages, live updates via Parse Live Queries.
- Conversation list view showing all active message threads.
- RSVP system: users can sign up for tasks directly from the task modal; RSVP state is persisted in Parse.
- `rsvpService` to handle RSVP create/delete operations.
- `seedContacts` utility to populate test contact data in Back4App.
- `SeedPage` component for triggering data seeding in development.
- Global search now covers tasks, trainings, contacts, and users from a single query.

### Changed
- Profile page fully redesigned with updated layout and user info display.
- Task modal expanded to show full task details including contact info, certificate aid, and RSVP controls.
- `searchService` refactored to query all entity types in parallel.
- `AuthService` updated to support firstName/lastName fields on registration.

---

## [v0.5.0] - 2026-04-23

### Added
- Profile page showing user info, contacts, and navigation to messaging.
- `ContactList` component listing all contacts with links to individual contact pages.
- Initial `Messaging` component and `MessagingService` for sending and receiving messages.

### Changed
- `Contact` page updated to display richer contact details.
- Routing updated to include `/profile`, `/profile/:id`, `/contacts`, `/messages`, and `/chat/:id`.

---

## [v0.4.0] - 2026-04-12

### Added
- Interactive map view using Mapbox GL, displaying task and training pins by GPS coordinates.
- `TaskModal` component showing task details when a pin is selected.
- `TrainingModal` component showing training details when a pin is selected.
- `searchService` for querying tasks, trainings, and contacts.
- Latitude/Longitude fields added to Tasks and Trainings in Back4App.
- Map-level search bar with dropdown results and fly-to navigation.
- `tasksService` and `trainingsService` for fetching and transforming Parse data.

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
