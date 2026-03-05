## Summary of Changes:
In this update, we replaced the original House components with a new Tasks system that better matches the project requirements. We created a Tasks class and connected it to a ContactInfo class using a Pointer relationship in Parse. We also added React Router so users can click on a task’s contact information and navigate to a separate Contact page. The project now uses two Parse models, properly loads asynchronous data with hooks, and separates components more clearly based on responsibility.

## UML Diagram
* Class: Tasks 
| Field Name     | Type                  | Description                                       |
| -------------- | --------------------- | ------------------------------------------------- |
| objectId       | String                | Unique identifier (auto-generated)                |
| Description    | String                | Description of the task                           |
| Location       | String                | Task location                                     |
| Openings       | Number                | Number of available openings                      |
| CertificateAid | Boolean/String        | Indicates if certification assistance is provided |
| trainingNeeded | Boolean/String        | Indicates if training is required                 |
| contact        | Pointer → ContactInfo | Associated contact information                    |

* Class: Contact
| Field Name       | Type   | Description                        |
| ---------------- | ------ | ---------------------------------- |
| objectId         | String | Unique identifier (auto-generated) |
| Name             | String | Contact person's name              |
| PhoneNumber      | String | Contact phone number               |
| Email            | String | Contact email address              |
| ServiceLocations | String | Areas serviced                     |
