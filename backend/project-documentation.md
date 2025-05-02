# UPaFi Backend

## Key Features

- **Skill Assessment**: Automatically evaluates student skills based on academic grades and allows self-assessment
- **Career Recommendations**: Suggest the best career path based on skill proficiency and/or evaluates a career path against student's skills
- **Career Reports**: Generates reports showing skills and improvement areas for a specific career path
- **File Management**: Secure uploading and retrieval of academic records and CV files
- **PDF Generation**: Creates PDF reports for students to share with tutors

## System Architecture

1. **Data Access Layer (DAOs)**: Direct database interaction
2. **Service Layer**: Business logic coordination
3. **Logic Layer**: Core algorithms and calculations
4. **Routes Layer**: API endpoints and request handling
5. **Config Layer**: System configuration and middleware
6. **Database**: PostgreSQL database for data persistence

## Database Structure

### Core Entities

- **User**: User authentication and role information
- **Profile**: Student profile information including personal details and degree
- **Tutor profile**: Tutor profile information including personal details and list of associated students
- **Degree**: Academic programs of U-TAD
- **Subject**: Courses within each degree program
- **Skill**: Individual skills that can be developed during courses at U-TAD
- **CareerField**: Career paths in general
- **CareerType**: Specific career paths with specified types (jobs or internships)

### Junction Tables

- **DegreeSubject**: Maps subjects to degrees
- **StudentGrade**: Stores student grades for subjects
- **ProfileSkill**: Stores student skill levels
- **SkillMap**: Maps subjects to skills with weighted relationships
- **CareerSkill**: Stores skill requirements for career paths
- **CareerReport**: Stores career assessment reports
- **SkillAssessment**: Stores skill evaluations within reports

## File Management

The system implements a secure file management approach:

1. **Private Storage**: Files are stored in a private directory structure not directly accessible via HTTP
2. **Secure Access**: Files are served through authenticated API endpoints with proper authorization checks
3. **File Types**:
   - Academic Records: Student academic transcripts (PDF/HTML/Excel)
   - CVs: Student resumes (PDF)
   - Reports: Generated career recommendation reports (HTML/PDF)

## API Documentation

The API is organized around several main parts: Authentication, Profiles, Skills, Careers, Reports, and Files. For more information, see `api-documentation.md`.

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create new user account |
| `/api/auth/login` | POST | Authenticate and get token |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password with token |

### Profiles

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profiles/login` | POST | Authenticate user |
| `/api/profiles/:id` | GET | Get profile information |
| `/api/profiles/:id` | PUT | Update profile information |
| `/api/profiles/:id/complete-student` | GET | Get complete profile with skills |
| `/api/profiles/:id/courses` | POST | Add courses to profile |
| `/api/profiles/:id/grades` | POST | Add grades to profile |
| `/api/profiles/:id/upload-academic-record` | POST | Upload academic record |
| `/api/profiles/:id/upload-cv` | POST | Upload CV |

### Tutors

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tutors` | GET | List all tutors |
| `/api/tutors/:id` | GET | Get tutor by ID |
| `/api/tutors` | POST | Create tutor profile |
| `/api/tutors/:id` | PUT | Update tutor profile |
| `/api/tutors/:id/students` | GET | Get tutor's students |
| `/api/tutors/search-students` | GET | Search students by name |
| `/api/profiles/:profileId/tutor` | PUT | Assign tutor to student |
| `/api/profiles/:profileId/tutor` | GET | Get student's tutor |

### Skills

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/skills` | GET | List all available skills |
| `/api/profiles/:id/skills` | GET | Get skills for a profile |
| `/api/profiles/:id/skills/initialize` | POST | Initialize skills from grades |
| `/api/profiles/:id/skills/:skillId` | PUT | Update a specific skill |
| `/api/profiles/:id/skills` | PUT | Bulk update skills (self-assessment) |

### Careers

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/careers/fields` | GET | List all career fields |
| `/api/careers/fields/:id/types` | GET | Get career types for a field |
| `/api/careers/skills/:careerTypeId` | GET | Get skills for a career type |
| `/api/profiles/:id/recommendations` | GET | Get career recommendations |
| `/api/profiles/:id/recommendations/:careerTypeId` | GET | Get specific career assessment |

### Reports

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profiles/:id/reports` | GET | List reports for a profile |
| `/api/reports/:id` | GET | Get report details |
| `/api/reports` | POST | Create a new report |
| `/api/profiles/:id/save-recommendation` | POST | Save career recommendation |
| `/api/reports/:reportId/assessments/:id` | PUT | Update assessment |
| `/api/reports/:id/pdf` | GET | Generate PDF for a report |

### Files

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/files/:type/:filename` | GET | Get protected file |

## Logic Algorithms

### Skills Initialization

The system initializes student skills based on their academic grades:

1. For each completed subject:
   - Retrieve associated skills through SkillMaps
   - Calculate weighted skill levels based on grades and predefined weights
   - Normalize to a 0-5 scale

2. If no grades are available, all skills are initialized to 0

### Career Recommendation

Two main algorithms handle career recommendations:

1. **Specific Career Assessment** (`calculateCareerFitness`):
   - Compares student skill levels against career requirements
   - Calculates gaps between current and required skill levels
   - Determines an overall fitness score on a 0-5 scale

2. **General Recommendations** (`recommendCareers`):
   - Evaluates student fit across multiple career paths
   - Sorts careers by fitness score
   - Can filter by career field or type (job/internship)

Fitness score calculation:
- For each skill, calculate gap = max(0, requiredLevel - currentLevel)
- Average these gaps across all required skills
- Fitness score = 5 - averageGap

## Project Structure

```
utad-tutorship-platform/
├── config/                 # Configuration files
│   ├── auth-middleware.js  # Authentication middleware
│   ├── file-storage.js     # File upload configuration
│
├── daos/                   # Data Access Objects
│   ├── base-dao.js         # Common database operations
│   ├── user-dao.js         # User data access
│   ├── profile-dao.js      # Profile data access
│   ├── academic-dao.js     # Degree and subject data
│   ├── skills-dao.js       # Skills data access
│   ├── career-dao.js       # Career data access
│   ├── report-dao.js       # Report data access
│   ├── auth-dao.js         # Authentication data access
│   ├── tutor-dao.js        # Tutor data access
│   ├── dao-index.js        # DAO initialization
│   └── db-config.js        # Database configuration
│
├── services/               # Business Logic Services
│   ├── profile-service.js  # User and profile management
│   ├── skill-service.js    # Skill assessment and management
│   ├── career-recommendation-service.js  # Career recommendations
│   ├── report-service.js   # Report generation and management
│   ├── auth-service.js     # Authentication and authorization
│   ├── tutor-service.js    # Tutor profile management
│   ├── academic-parser-service.js # Academic record parsing
│   └── service-index.js    # Service initialization
│
├── logic/                  # Core Algorithms
│   └── career-recommendation-logic.js  # Recommendation algorithms
│
├── routes/                 # API Routes
│   ├── profile-routes.js   # Profile API endpoints
│   ├── skill-routes.js     # Skills API endpoints
│   ├── career-routes.js    # Career API endpoints
│   ├── report-routes.js    # Report API endpoints
│   ├── auth-routes.js      # Authentication endpoints
│   ├── tutor-routes.js     # Tutor management endpoints
│   ├── profile-tutor-routes.js # Student-tutor relationship
│   ├── file-access-routes.js # Protected file access
│   └── routes-index.js     # Route registration
│
├── private/                # Private file storage (not web-accessible)
│   └── uploads/            # Uploaded files
│       ├── academic_records/  # Student academic records
│       ├── cvs/            # Student CVs
│       └── reports/        # Generated reports
│
├── public/                 # Public static files
│   └── reports/            # Legacy location for public reports
│
├── app-setup.js           # Express application setup
├── server.js              # Server entry point
└── db-creation-script.sql # Database initialization script
```