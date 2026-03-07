## Summary of Changes
In this update, the application structure was reorganized to better match a new component hierarchy. A main `Component` router was added to handle navigation between different parts of the app. The system now supports both **Tasks** and **Trainings**, each with their own list components and routes. Tasks are still connected to the **ContactInfo** class using a Pointer relationship in Parse, allowing users to navigate to a contact page when selecting contact information. The project now loads data asynchronously from Parse for both tasks and trainings.

## Required Packages
- react
- react-dom
- react-router-dom
- parse
- vite

## UML Diagram

### Class: Tasks
| Field Name        | Type                  | Description                                       |
|-------------------|----------------------|---------------------------------------------------|
| objectId          | String               | Unique identifier (auto-generated)                |
| Description       | String               | Description of the task                           |
| Location          | String               | Task location                                     |
| Openings          | Number               | Number of available openings                      |
| CertificateAid    | Boolean/String       | Indicates if certification assistance is provided |
| trainingNeeded    | Boolean/String       | Indicates if training is required                 |
| contact           | Pointer → ContactInfo| Associated contact information                    |

### Class: Trainings
| Field Name     | Type   | Description                              |
|----------------|--------|------------------------------------------|
| objectId       | String | Unique identifier (auto-generated)       |
| Description    | String | Description of the training session      |
| Location       | String | Where the training takes place           |
| maxCapacity    | Number | Maximum number of participants allowed   |

### Class: ContactInfo
| Field Name       | Type   | Description                        |
|------------------|--------|------------------------------------|
| objectId         | String | Unique identifier (auto-generated) |
| Name             | String | Contact person's name              |
| PhoneNumber      | String | Contact phone number               |
| Email            | String | Contact email address              |
| ServiceLocations | String | Areas serviced                     |
