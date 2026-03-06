
# Change Log
All notable changes to this project will be documented in this file.
 
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).
 
## [Pre-released] - 2026-03-06
In this update, the application structure was reorganized to better match a new component hierarchy. A main Component router was added to handle navigation between different parts of the app. The system now supports both Tasks and Trainings, each with their own list components and routes. Tasks are still connected to the ContactInfo class using a Pointer relationship in Parse, allowing users to navigate to a contact page when selecting contact information. The project now loads data asynchronously from Parse for both tasks and trainings.
 
### Added
- Application routing for navigating between components.
- Database connection for retrieving project data.
- Data parsing logic for processing database responses.
- Development build setup using Vite.

### Changed
- Updated application layout to support the new routing structure.
- Refactored component organization for better maintainability.

### Fixed
- Fixed component structure to properly align with the two main components.
