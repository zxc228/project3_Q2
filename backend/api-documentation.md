# U-TAD Tutorship Platform API Documentation

This document contains documentation for the RESTful API endpoints for the UPaFi backend.

## Base URL

All API endpoints are prefixed with `/api`.

## Authentication

The API uses JSON Web Tokens (JWT) for authentication.

1. First, obtain a token by using the `/api/auth/login` endpoint
2. For all other endpoints, include the token in the Authorization header: `Authorization: Bearer your_token_here`

All routes except for the authentication routes (`/api/auth/*`) require authentication.

## Error Handling

All endpoints follow the same error response format:

```json
{
  "error": "Error message description"
}
```

HTTP status codes used:
- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Invalid token
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server-side error


## Authentication Endpoints

### Register User

Creates a new user account.

**URL:** `/api/auth/register`  
**Method:** `POST`  
**Auth Required:** No

**Request Body:**
```json
{
  "id": "user_john",
  "email": "john.doe@live.u-tad.com",
  "password": "securepassword123",
  "role": "STUDENT"
}
```

**Success Response:**  
**Code:** `201 Created`  
**Content:**
```json
{
  "user": {
    "id": "user_john",
    "email": "john.doe@live.u-tad.com",
    "role": "STUDENT"
  }
}
```

**Error Responses:**  
**Code:** `400 Bad Request`  
**Content:** `{ "error": "Fill in all required fields (id, email, password, role)" }`

**Code:** `409 Conflict`  
**Content:** `{ "error": "User with this email already exists" }`

---

### Login

Authenticates a user and returns a JWT token.

**URL:** `/api/auth/login`  
**Method:** `POST`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "john.doe@live.u-tad.com",
  "password": "securepassword123"
}
```

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "user": {
    "id": "user_john",
    "email": "john.doe@live.u-tad.com",
    "role": "STUDENT"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**  
**Code:** `400 Bad Request`  
**Content:** `{ "error": "Email and password are required" }`

**Code:** `401 Unauthorized`  
**Content:** `{ "error": "Invalid login credentials" }`

---

## Profile Endpoints

There are two types of Profiles in the platform:
- **Student**: Can access their own profile, skills, career recommendations, and reports. Student profiles are named just "profiles" throughout the code.
- **Tutor**: Can access student profiles they tutor, view reports.

### Authenticate User

Logs in a user and returns profile information.

**URL:** `/api/profiles/login`  
**Method:** `POST`  
**Auth Required:** No

**Request Body:**
```json
{
  "email": "alice.asher@live.u-tad.com",
  "password": "tempHash123"
}
```

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "user": {
    "id": "user_alice",
    "email": "alice.asher@live.u-tad.com",
    "role": "STUDENT"
  },
  "profile": {
    "id": "profile_alice",
    "firstName": "Alice",
    "lastName": "Asher",
    "degreeId": "deg_data",
    "graduationYear": 2026,
    "bio": "Data Engineering student with a passion for travel..."
  }
}
```

**Error Responses:**  
**Code:** `400 Bad Request`  
**Content:** `{ "error": "Email and password are required" }`

**Code:** `401 Unauthorized`  
**Content:** `{ "error": "Invalid credentials" }`

---

### Get Profile Information

Retrieves detailed profile information including academic data and assigned tutor.

**URL:** `/api/profiles/:id`  
**Method:** `GET`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Profile ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "profile": {
    "id": "profile_alice",
    "userId": "user_alice",
    "firstName": "Alice",
    "lastName": "Asher",
    "degreeId": "deg_data",
    "graduationYear": 2026,
    "bio": "Data Engineering student with a passion for travel...",
    "tutorId": "tutor_1"
  },
  "user": {
    "id": "user_alice",
    "email": "alice.asher@live.u-tad.com",
    "role": "STUDENT"
  },
  "academic": {
    "degree": {
      "id": "deg_data",
      "name": "Data Engineering",
      "description": "Comprehensive program focusing on big data technologies..."
    },
    "subjects": [
      {
        "id": "sub_pro3",
        "code": "PRO3",
        "name": "Projects 3",
        "description": "Real-world collaborative development projects..."
      },
      // Additional subjects...
    ],
    "grades": [
      {
        "id": "grade_alice_pro3",
        "subjectId": "sub_pro3",
        "profileId": "profile_alice",
        "grade": 8.0,
        "status": "COMPLETED"
      },
      // Additional grades...
    ]
  },
  "tutor": {
    "id": "tutor_1",
    "firstName": "Carlos",
    "lastName": "Montero",
    "specialization": "Advanced Data Science",
    "department": "Data Engineering"
  }
}
```

**Error Response:**  
**Code:** `404 Not Found`  
**Content:** `{ "error": "Profile not found" }`

---

### Update Profile

Updates profile information.

**URL:** `/api/profiles/:id`  
**Method:** `PUT`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Profile ID)

**Request Body:**
```json
{
  "firstName": "Alice M.",
  "lastName": "Asher",
  "degreeId": "deg_data",
  "graduationYear": 2027,
  "bio": "Updated bio information..."
}
```

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "id": "profile_alice",
  "userId": "user_alice",
  "firstName": "Alice M.",
  "lastName": "Asher",
  "degreeId": "deg_data",
  "graduationYear": 2027,
  "bio": "Updated bio information..."
}
```

**Error Responses:**  
**Code:** `400 Bad Request`  
**Content:** `{ "error": "Profile data is required" }`

**Code:** `400 Bad Request`  
**Content:** `{ "error": "Invalid degree selected" }`

**Code:** `404 Not Found`  
**Content:** `{ "error": "Profile not found" }`


## Tutor Endpoints

### Get All Tutors

Returns a list of all tutors in the system.

**URL:** `/api/tutors`  
**Method:** `GET`  
**Auth Required:** Yes  
**Authorization:** Admin or Teacher role

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
[
  {
    "id": "alberto",
    "userId": "user_alberto",
    "firstName": "Alberto",
    "lastName": "Leon Martin",
    "bio": "Professor, manager, business coach"
  },
  // other tutors ...
]
```

---

### Get Tutor by ID

Retrieves a specific tutor's information.

**URL:** `/api/tutors/:id`  
**Method:** `GET`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Tutor ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "id": "alberto",
  "userId": "user_alberto",
  "firstName": "Alberto",
  "lastName": "Leon Martin",
  "bio": "Professor, manager, business coach"
}
```

**Error Response:**  
**Code:** `404 Not Found`  
**Content:** `{ "error": "Tutor not found" }`

---

### Create Tutor Profile

Creates a new tutor profile.

**URL:** `/api/tutors`  
**Method:** `POST`  
**Auth Required:** Yes  
**Authorization:** Admin role

**Request Body:**
```json
{
  "id": "alberto",
  "userId": "user_alberto",
  "firstName": "Alberto",
  "lastName": "Leon Martin",
  "bio": "Professor, manager, business coach"
}
```

**Success Response:**  
**Code:** `201 Created`  
**Content:**
```json
{
  "id": "alberto",
  "userId": "user_alberto",
  "firstName": "Alberto",
  "lastName": "Leon Martin",
  "bio": "Professor, manager, business coach"
}
```

**Error Responses:**  
**Code:** `400 Bad Request`  
**Content:** `{ "error": "Required fields missing" }`

**Code:** `403 Forbidden`  
**Content:** `{ "error": "Insufficient permissions" }`

---

### Update Tutor Profile

Updates an existing tutor profile.

**URL:** `/api/tutors/:id`  
**Method:** `PUT`  
**Auth Required:** Yes  
**Authorization:** Admin role or the tutor themselves
**URL Params:** `id=[string]` (Tutor ID)

**Request Body:**
```json
{
  "bio": "Updated bio information...",
}
```

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "id": "alberto",
  "userId": "user_alberto",
  "firstName": "Alberto",
  "lastName": "Leon Martin",
  "bio": "Updated bio information..."
},
```

**Error Responses:**  
**Code:** `403 Forbidden`  
**Content:** `{ "error": "Insufficient permissions" }`

**Code:** `404 Not Found`  
**Content:** `{ "error": "Tutor not found" }`

---

### Get Tutor's Students

Returns all students assigned to a tutor.

**URL:** `/api/tutors/:id/students`  
**Method:** `GET`  
**Auth Required:** Yes  
**Authorization:** Admin role or the tutor themselves
**URL Params:** `id=[string]` (Tutor ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
[
  {
    "id": "profile_alice",
    "firstName": "Alice",
    "lastName": "Asher",
    "degreeId": "deg_data",
    "degree": {
      "id": "deg_data",
      "name": "Data Engineering"
    },
    "graduationYear": 2026,
    "email": "alice.asher@live.u-tad.com"
  },
  {
    "id": "profile_bob",
    "firstName": "Bob",
    "lastName": "Bobchinsky",
    "degreeId": "deg_cyber",
    "degree": {
      "id": "deg_cyber",
      "name": "Cyber Security"
    },
    "graduationYear": 2026,
    "email": "bob.bobchinsky@live.u-tad.com"
  }
]
```

**Error Responses:**  
**Code:** `403 Forbidden`  
**Content:** `{ "error": "Insufficient permissions" }`

**Code:** `404 Not Found`  
**Content:** `{ "error": "Tutor not found" }`

---

### Assign Tutor to Student

Assigns a tutor to a student.

**URL:** `/api/profiles/:profileId/tutor`  
**Method:** `PUT`  
**Auth Required:** Yes  
**Authorization:** Admin role
**URL Params:** `profileId=[string]` (Student Profile ID)

**Request Body:**
```json
{
  "tutorId": "alberto"
}
```

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "id": "profile_alice",
  "firstName": "Alice",
  "lastName": "Asher",
  "tutorId": "alberto",
  "tutor": {
    "id": "alberto",
    "firstName": "Alberto",
    "lastName": "Leon Martin"
  }
}
```

**Error Responses:**  
**Code:** `400 Bad Request`  
**Content:** `{ "error": "Tutor ID is required" }`

**Code:** `403 Forbidden`  
**Content:** `{ "error": "Insufficient permissions" }`

**Code:** `404 Not Found`  
**Content:** `{ "error": "Profile or tutor not found" }`

---

### Get Student's Tutor

Retrieves the tutor assigned to a student.

**URL:** `/api/profiles/:profileId/tutor`  
**Method:** `GET`  
**Auth Required:** Yes  
**URL Params:** `profileId=[string]` (Student Profile ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "id": "alberto",
  "userId": "user_alberto",
  "firstName": "Alberto",
  "lastName": "Leon Martin",
  "bio": "Professor, manager, business coach"
},
```

**Error Responses:**  
**Code:** `404 Not Found`  
**Content:** `{ "error": "Profile not found" }`

**Code:** `404 Not Found`  
**Content:** `{ "error": "No tutor assigned to this student" }`

---

## Skills Endpoints

### Get All Skills

Returns a list of all available skills in the system.

**URL:** `/api/skills`  
**Method:** `GET`  
**Auth Required:** Yes

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
[
  {
    "id": "skill_sql",
    "name": "SQL",
    "description": "Structured Query Language for database management and queries."
  },
  {
    "id": "skill_py",
    "name": "Python",
    "description": "Python programming language proficiency."
  },
  // Additional skills...
]
```

---

### Get Profile Skills

Retrieves all skills for a specific profile.

**URL:** `/api/profiles/:id/skills`  
**Method:** `GET`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Profile ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
[
  {
    "id": "ps_alice_sql",
    "profileId": "profile_alice",
    "skillId": "skill_sql",
    "skillName": "SQL",
    "skillDescription": "Structured Query Language for database management and queries.",
    "skillLevel": 4.8,
    "updatedAt": "2025-04-27T14:30:00.000Z"
  },
  // Additional skills...
]
```

**Error Response:**  
**Code:** `404 Not Found`  
**Content:** `{ "error": "Profile not found" }`

---

### Initialize Profile Skills

Initializes skill levels for a profile based on academic grades.

**URL:** `/api/profiles/:id/skills/initialize`  
**Method:** `POST`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Profile ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
[
  {
    "id": "ps_alice_sql",
    "profileId": "profile_alice",
    "skillId": "skill_sql",
    "skillName": "SQL",
    "skillDescription": "Structured Query Language for database management and queries.",
    "skillLevel": 4.8,
    "updatedAt": "2025-04-27T14:30:00.000Z"
  },
  // Additional skills...
]
```

**Error Response:**  
**Code:** `404 Not Found`  
**Content:** `{ "error": "Profile not found" }`

---

### Update Single Skill

Updates a specific skill level for a profile.

**URL:** `/api/profiles/:id/skills/:skillId`  
**Method:** `PUT`  
**Auth Required:** Yes  
**URL Params:** 
- `id=[string]` (Profile ID)
- `skillId=[string]` (Skill ID)

**Request Body:**
```json
{
  "skillLevel": 4.5
}
```

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "id": "ps_alice_sql",
  "profileId": "profile_alice",
  "skillId": "skill_sql",
  "skillLevel": 4.5,
  "updatedAt": "2025-04-27T15:45:00.000Z"
}
```

**Error Responses:**  
**Code:** `400 Bad Request`  
**Content:** `{ "error": "Skill level is required" }`

**Code:** `400 Bad Request`  
**Content:** `{ "error": "Skill level must be between 0 and 5" }`

**Code:** `404 Not Found`  
**Content:** `{ "error": "Profile skill not found" }`

---

### Bulk Update Skills

Updates multiple skills at once, typically during self-assessment.

**URL:** `/api/profiles/:id/skills`  
**Method:** `PUT`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Profile ID)

**Request Body:**
```json
{
  "skills": [
    {
      "skillId": "skill_sql",
      "skillLevel": 4.5
    },
    {
      "skillId": "skill_py",
      "skillLevel": 3.8
    },
    // Additional skills...
  ]
}
```

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
[
  {
    "id": "ps_alice_sql",
    "profileId": "profile_alice",
    "skillId": "skill_sql",
    "skillName": "SQL",
    "skillDescription": "Structured Query Language for database management and queries.",
    "skillLevel": 4.5,
    "updatedAt": "2025-04-27T15:45:00.000Z"
  },
  // Additional updated skills...
]
```

**Error Responses:**  
**Code:** `400 Bad Request`  
**Content:** `{ "error": "Skills array is required" }`

**Code:** `400 Bad Request`  
**Content:** `{ "error": "Skill level for skill_sql must be between 0 and 5" }`

**Code:** `404 Not Found`  
**Content:** `{ "error": "Profile not found" }`

---

## Career Endpoints

### Get All Career Fields

Returns a list of all available career fields.

**URL:** `/api/careers/fields`  
**Method:** `GET`  
**Auth Required:** Yes

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
[
  {
    "id": "cf_dpm",
    "name": "Data Product Manager",
    "description": "Professional responsible for data product development and strategy."
  },
  {
    "id": "cf_de",
    "name": "Data Engineering",
    "description": "Focuses on building systems to collect, store, and analyze data."
  },
  // Additional career fields...
]
```

---

### Get Career Types by Field

Returns all career types (job/internship) for a specific field.

**URL:** `/api/careers/fields/:id/types`  
**Method:** `GET`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Career Field ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
[
  {
    "id": "ct_de_int",
    "careerFieldId": "cf_de",
    "type": "INTERNSHIP",
    "description": "Entry-level role learning data engineering fundamentals."
  },
  {
    "id": "ct_de_job",
    "careerFieldId": "cf_de",
    "type": "JOB",
    "description": "Professional role building and optimizing data pipelines."
  }
]
```

---

### Get Career Recommendations

Returns career recommendations for a profile, optionally filtered by field or type.

**URL:** `/api/profiles/:id/recommendations`  
**Method:** `GET`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Profile ID)  
**Query Params:**
- `careerFieldId=[string]` (Optional - Filter by career field)
- `careerType=[string]` (Optional - Filter by "INTERNSHIP" or "JOB")

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "topRecommendations": [
    {
      "careerFieldId": "cf_de",
      "careerFieldName": "Data Engineering",
      "careerTypeId": "ct_de_job",
      "careerType": "JOB",
      "fitnessScore": 4.2,
      "skillAssessments": [
        {
          "skillId": "skill_sql",
          "skillName": "SQL",
          "currentLevel": 4.8,
          "importanceLevel": 5.0,
          "gap": 0.2
        },
        // Additional skill assessments...
      ]
    },
    // Additional recommendations (up to 5)...
  ],
  "allRecommendations": [
    // All recommendations sorted by fitness score...
  ]
}
```

**Error Response:**  
**Code:** `404 Not Found`  
**Content:** `{ "error": "Profile not found" }`

---

### Get Specific Career Recommendation

Returns a detailed assessment for a specific career path.

**URL:** `/api/profiles/:id/recommendations/:careerTypeId`  
**Method:** `GET`  
**Auth Required:** Yes  
**URL Params:** 
- `id=[string]` (Profile ID)
- `careerTypeId=[string]` (Career Type ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "careerFieldId": "cf_de",
  "careerFieldName": "Data Engineering",
  "careerTypeId": "ct_de_job",
  "careerType": "JOB",
  "fitnessScore": 4.2,
  "skillAssessments": [
    {
      "skillId": "skill_sql",
      "skillName": "SQL",
      "currentLevel": 4.8,
      "importanceLevel": 5.0,
      "gap": 0.2
    },
    {
      "skillId": "skill_py",
      "skillName": "Python",
      "currentLevel": 3.8,
      "importanceLevel": 4.5,
      "gap": 0.7
    },
    // Additional skill assessments...
  ]
}
```

**Error Responses:**  
**Code:** `404 Not Found`  
**Content:** `{ "error": "Profile not found" }`

**Code:** `404 Not Found`  
**Content:** `{ "error": "Career type not found" }`

**Code:** `404 Not Found`  
**Content:** `{ "error": "Career field not found" }`

---

## Report Endpoints

### Get Profile Reports

Returns a list of all reports generated for a profile.

**URL:** `/api/profiles/:id/reports`  
**Method:** `GET`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Profile ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
[
  {
    "id": "report_123",
    "profileId": "profile_alice",
    "careerTypeId": "ct_de_job",
    "additionalInfo": "Career report for Data Engineering position",
    "pdfUrl": "/reports/report_123.pdf",
    "createdAt": "2025-04-25T15:00:00.000Z",
    "careerType": "JOB",
    "careerFieldName": "Data Engineering"
  },
  // Additional reports...
]
```

---

### Get Report Details

Returns detailed information about a specific career report.

**URL:** `/api/reports/:id`  
**Method:** `GET`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Report ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "report": {
    "id": "report_123",
    "profileId": "profile_alice",
    "careerTypeId": "ct_de_job",
    "additionalInfo": "Career report for Data Engineering position",
    "pdfUrl": "/reports/report_123.pdf",
    "createdAt": "2025-04-25T15:00:00.000Z"
  },
  "assessments": [
    {
      "id": "assessment_1",
      "careerReportId": "report_123",
      "skillId": "skill_sql",
      "skillName": "SQL",
      "skillDescription": "Structured Query Language for database management and queries.",
      "hasSelfAssessed": true,
      "systemRating": 4.8,
      "justification": "Initial assessment based on academic performance and self-assessment. Current level: 4.8, Required level: 5.0"
    },
    // Additional assessments...
  ],
  "career": {
    "type": {
      "id": "ct_de_job",
      "careerFieldId": "cf_de",
      "type": "JOB",
      "description": "Professional role building and optimizing data pipelines."
    },
    "field": {
      "id": "cf_de",
      "name": "Data Engineering",
      "description": "Focuses on building systems to collect, store, and analyze data."
    }
  }
}
```

**Error Response:**  
**Code:** `404 Not Found`  
**Content:** `{ "error": "Report not found" }`

---

### Create Report

Creates a new career report based on a recommendation.

**URL:** `/api/reports`  
**Method:** `POST`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "profileId": "profile_alice",
  "recommendation": {
    "careerTypeId": "ct_de_job",
    "skillAssessments": [
      {
        "skillId": "skill_sql",
        "skillName": "SQL",
        "currentLevel": 4.8,
        "importanceLevel": 5.0,
        "gap": 0.2
      },
      // Additional skill assessments...
    ]
  },
  "additionalInfo": "Career report for Data Engineering position"
}
```

**Success Response:**  
**Code:** `201 Created`  
**Content:**
```json
{
  "report": {
    "id": "report_123",
    "profileId": "profile_alice",
    "careerTypeId": "ct_de_job",
    "additionalInfo": "Career report for Data Engineering position",
    "createdAt": "2025-04-27T15:00:00.000Z"
  },
  "assessments": [
    // Skill assessments...
  ],
  "career": {
    "type": {
      "id": "ct_de_job",
      "type": "JOB",
      // Additional type info...
    },
    "field": {
      "id": "cf_de",
      "name": "Data Engineering",
      // Additional field info...
    }
  }
}
```

**Error Response:**  
**Code:** `400 Bad Request`  
**Content:** `{ "error": "Profile ID and recommendation data are required" }`

**Code:** `400 Bad Request`  
**Content:** `{ "error": "Invalid recommendation data" }`

---

### Update Skill Assessment

Updates a skill assessment within a report.

**URL:** `/api/reports/:reportId/assessments/:id`  
**Method:** `PUT`  
**Auth Required:** Yes  
**URL Params:** 
- `reportId=[string]` (Report ID)
- `id=[string]` (Assessment ID)

**Request Body:**
```json
{
  "systemRating": 4.2,
  "justification": "Updated assessment based on additional coursework."
}
```

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "id": "assessment_1",
  "careerReportId": "report_123",
  "skillId": "skill_sql",
  "hasSelfAssessed": true,
  "systemRating": 4.2,
  "justification": "Updated assessment based on additional coursework."
}
```

**Error Response:**  
**Code:** `400 Bad Request`  
**Content:** `{ "error": "Assessment data is required" }`

---

### Generate PDF Report

Generates a PDF version of a report.

**URL:** `/api/reports/:id/pdf`  
**Method:** `GET`  
**Auth Required:** Yes  
**URL Params:** `id=[string]` (Report ID)

**Success Response:**  
**Code:** `200 OK`  
**Content:**
```json
{
  "pdfUrl": "/reports/report_123.pdf"
}
```

**Error Response:**  
**Code:** `404 Not Found`  
**Content:** `{ "error": "Report not found" }`

---

## Status Codes

* `200 OK` - Request succeeded
* `201 Created` - Resource created successfully
* `400 Bad Request` - Invalid input
* `401 Unauthorized` - Authentication required
* `404 Not Found` - Resource not found
* `500 Internal Server Error` - Server-side error

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS) to allow requests from the frontend application.
