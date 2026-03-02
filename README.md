## Summary of Changes:
In this update, I replaced the original House components with a new Tasks system that better matches the project requirements. I created a Tasks class and connected it to a ContactInfo class using a Pointer relationship in Parse. I also added React Router so users can click on a task’s contact information and navigate to a separate Contact page. The project now uses two Parse models, properly loads asynchronous data with hooks, and separates components more clearly based on responsibility.

## Class: Tasks
| Field Name     | Type                  | Description                                       |
| -------------- | --------------------- | ------------------------------------------------- |
| objectId       | String                | Unique identifier (auto-generated)                |
| Description    | String                | Description of the task                           |
| Location       | String                | Task location                                     |
| Openings       | Number                | Number of available openings                      |
| CertificateAid | Boolean/String        | Indicates if certification assistance is provided |
| trainingNeeded | Boolean/String        | Indicates if training is required                 |
| contact        | Pointer → ContactInfo | Associated contact information                    |

## Class: ContactInfo
| Field Name       | Type   | Description                        |
| ---------------- | ------ | ---------------------------------- |
| objectId         | String | Unique identifier (auto-generated) |
| Name             | String | Contact person's name              |
| PhoneNumber      | String | Contact phone number               |
| Email            | String | Contact email address              |
| ServiceLocations | String | Areas serviced                     |

## Relationship Diagram:
Tasks
-----
objectId
Description
Location
Openings
CertificateAid
trainingNeeded
contact 

-------------------->
                               ContactInfo
                               ------------
                               objectId
                               Name
                               PhoneNumber
                               Email
                               ServiceLocations

## Component Tree Diagram:
App
 ├── TaskList
 
 │     ├── Task
 │
 
 └── Contact
