# UPaFi Backend

## Key Features

- **Skill Assessment**: Automatically evaluates student skills based on academic grades and allows self-assessment
- **Career Recommendations**: Suggest the best career path based on skill proficiency and/or evaluates a career path against student's skills
- **Career Reports**: Generates reports showing skills and improvement areas for a specific career path
- **PDF Generation**: Creates PDF reports for students to share with tutors

## System Architecture

1. **Data Access Layer (DAOs)**: Direct database interaction
2. **Service Layer**: Business logic coordination
3. **Logic Layer**: Core algorithms and calculations
4. **Routes Layer**: API endpoints and request handling
5. **Database**: PostgreSQL database for data persistence



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



## API Documentation

The API is organized around four main parts: Profiles, SKills, Careers, and Reports. For more information, see `api-documentation.md`.

### Profiles

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profiles/login` | POST | Authenticate user |
| `/api/profiles/:id` | GET | Get complete profile information |
| `/api/profiles/:id` | PUT | Update profile information |


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
| `/api/profiles/:id/recommendations` | GET | Get career recommendations |
| `/api/profiles/:id/recommendations/:careerTypeId` | GET | Get specific career assessment |


### Reports

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profiles/:id/reports` | GET | List reports for a profile |
| `/api/reports/:id` | GET | Get report details |
| `/api/reports` | POST | Create a new report |
| `/api/reports/:reportId/assessments/:id` | PUT | Update assessment |
| `/api/reports/:id/pdf` | GET | Generate PDF for a report |




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
├── daos/                   # Data Access Objects
│   ├── base-dao.js         # Common database operations
│   ├── user-dao.js         # User data access
│   ├── profile-dao.js      # Profile data access
│   ├── academic-dao.js     # Degree and subject data
│   ├── skills-dao.js       # Skills data access
│   ├── career-dao.js       # Career data access
│   ├── report-dao.js       # Report data access
│   ├── dao-index.js        # DAO initialization
│   └── db-config.js        # Database configuration
│
├── services/               # Business Logic Services
│   ├── profile-service.js  # User and profile management
│   ├── skill-service.js    # Skill assessment and management
│   ├── career-recommendation-service.js  # Career recommendations
│   ├── report-service.js   # Report generation and management
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
│   └── routes-index.js     # Route registration
│
├── app-setup.js           # Express application setup
├── server.js              # Server entry point
└── db-creation-script.sql # Database initialization script
```