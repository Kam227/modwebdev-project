## ModWebDev Project

A React + Parse (Back4App) web app for connecting workers with tasks and trainings in their area. Users can browse an interactive map, RSVP for tasks, message other users, and manage their profile.

## Features
- Interactive Mapbox map showing task and training pins by GPS location
- Task and training detail modals with RSVP support
- Real-time messaging between users via Parse Live Queries
- User authentication (register/login) with protected routing
- Profile pages with contact info and conversation history
- Global search across tasks, trainings, contacts, and users

## Required Packages
- react
- react-dom
- react-router-dom
- parse
- react-map-gl
- mapbox-gl

## Back4App Data Model

### Class: Tasks
| Field Name      | Type                   | Description                                   |
|-----------------|------------------------|-----------------------------------------------|
| objectId        | String                 | Unique identifier (auto-generated)            |
| Description     | String                 | Description of the task                       |
| Location        | String                 | Human-readable location                       |
| Latitude        | Number                 | GPS latitude for map pin                      |
| Longitude       | Number                 | GPS longitude for map pin                     |
| Openings        | Number                 | Number of available openings                  |
| CertificateAid  | Pointer → Certificate  | Associated certificate/aid information        |
| trainingNeeded  | Boolean                | Whether training is required                  |
| contact         | Pointer → ContactInfo  | Associated contact                            |
| rsvps           | Array → Pointer→ _User | Users who have RSVP'd                         |

### Class: Trainings
| Field Name  | Type   | Description                            |
|-------------|--------|----------------------------------------|
| objectId    | String | Unique identifier (auto-generated)     |
| Description | String | Description of the training session    |
| Location    | String | Human-readable location                |
| Latitude    | Number | GPS latitude for map pin               |
| Longitude   | Number | GPS longitude for map pin              |
| maxCapacity | Number | Maximum number of participants allowed |

### Class: ContactInfo
| Field Name       | Type            | Description                              |
|------------------|-----------------|------------------------------------------|
| objectId         | String          | Unique identifier (auto-generated)       |
| Name             | String          | Contact person's name                    |
| PhoneNumber      | String          | Contact phone number                     |
| Email            | String          | Contact email address                    |
| ServiceLocations | String          | Areas serviced                           |
| contact          | Pointer → _User | Associated app user account              |

### Class: Message
| Field Name | Type            | Description                        |
|------------|-----------------|------------------------------------|
| objectId   | String          | Unique identifier (auto-generated) |
| text       | String          | Message body                       |
| sender     | Pointer → _User | User who sent the message          |
| receiver   | Pointer → _User | User who received the message      |

### Class: _User (Parse built-in)
| Field Name | Type   | Description                        |
|------------|--------|------------------------------------|
| objectId   | String | Unique identifier (auto-generated) |
| username   | String | Login username                     |
| email      | String | User email address                 |
| password   | String | Hashed password (managed by Parse) |
| firstName  | String | User's first name                  |
| lastName   | String | User's last name                   |
