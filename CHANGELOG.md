
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
 
## [v0.3.0] - 2026-03-27
In this update, authentication was integrated into the application using Parse. Users can now register and log in through dedicated authentication pages. Protected routes were implemented to restrict access to core pages like tasks, trainings, and contacts unless the user is authenticated. Routing was updated to include authentication paths and handle redirects based on login status, improving both security and overall user flow.

### Added
- User authentication (register and login) using Parse.
- ProtectedRoute component to restrict access to authenticated users.
- AuthRoute component to prevent logged-in users from accessing auth pages.
- Authentication pages for register and login.

### Changed
- Updated routing to include authentication paths.
- Modified navigation flow to redirect users based on authentication state.

### Fixed
- Fixed navigation issues where unauthorized users could access protected routes.
- Fixed routing behavior to properly handle redirects for both authenticated and unauthenticated users.
