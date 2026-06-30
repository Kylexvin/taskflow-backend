# TaskFlow API

A production-ready task management system API built with **Node.js**, **Express**, and **PostgreSQL**. Features JWT authentication, role-based access control (RBAC), and complete CRUD operations for projects, tasks, and comments.

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-blue)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)
- [Testing with Postman](#testing-with-postman)
- [Project Structure](#project-structure)
- [What I Learned](#what-i-learned)
- [License](#license)

---

## Features

### Core Features
- **User Authentication** - JWT-based secure login/register
- **Role-Based Access Control** - Admin, Manager, User roles
- **Project Management** - Full CRUD operations
- **Task Management** - Assign tasks with status, priority, story points
- **Comments** - Collaborative discussions on tasks
- **Dashboard Analytics** - Real-time project statistics

### Technical Features
- **PostgreSQL** - Relational database with UUID primary keys
- **Parameterized Queries** - Protection against SQL injection
- **Foreign Key Constraints** - Data integrity with ON DELETE CASCADE/SET NULL
- **Database Indexes** - Optimized query performance
- **Environment Configuration** - Secure `.env` management
- **Error Handling** - Centralized error middleware

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express** | Web framework |
| **PostgreSQL** | Relational database |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **pg** | PostgreSQL client |

### Database
| Feature | Implementation |
|---------|---------------|
| Primary Keys | UUID v4 (`uuid-ossp` extension) |
| Password Hashing | `pgcrypto` extension |
| Relationships | Foreign keys with constraints |
| Performance | Strategic indexes |

---

## Database Schema

### Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    USERS    │
│─────────────│
│ id (PK)     │◄──────────────┐
│ email       │               │
│ password_hash│              │
│ name         │              │
│ role         │              │
└─────────────┘               │
         ▲                    │
         │                    │
         │ (created_by)       │ (assignee_id, user_id)
         │                    │
┌─────────────┐               │
│  PROJECTS   │               │
│─────────────│               │
│ id (PK)     │               │
│ name        │               │
│ created_by  │───────────────┘
│ status      │
└─────────────┘
         ▲
         │
         │ (project_id)
         │
┌─────────────┐               ┌─────────────┐
│    TASKS    │───────────────│  COMMENTS   │
│─────────────│ (one-to-many) │─────────────│
│ id (PK)     │               │ id (PK)     │
│ title       │               │ content     │
│ assignee_id │               │ task_id (FK)│
│ project_id  │               │ user_id (FK)│
│ created_by  │               │ created_at  │
└─────────────┘               └─────────────┘
```

### Tables

#### Users
```sql
- id: UUID (PK)
- email: VARCHAR(255) UNIQUE NOT NULL
- password_hash: VARCHAR(255) NOT NULL
- name: VARCHAR(100) NOT NULL
- role: VARCHAR(20) DEFAULT 'user' (admin/manager/user)
- is_active: BOOLEAN DEFAULT true
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### Projects
```sql
- id: UUID (PK)
- name: VARCHAR(200) NOT NULL
- description: TEXT
- status: VARCHAR(20) DEFAULT 'planning' (planning/active/on_hold/completed)
- priority: VARCHAR(20) DEFAULT 'medium' (low/medium/high/critical)
- start_date: DATE
- end_date: DATE
- created_by: UUID (FK → users.id) ON DELETE SET NULL
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### Tasks
```sql
- id: UUID (PK)
- title: VARCHAR(200) NOT NULL
- description: TEXT
- status: VARCHAR(20) DEFAULT 'todo' (todo/in_progress/review/done/blocked)
- priority: VARCHAR(20) DEFAULT 'medium' (low/medium/high/critical)
- story_points: INT (0-100)
- due_date: DATE
- assignee_id: UUID (FK → users.id) ON DELETE SET NULL
- project_id: UUID (FK → projects.id) ON DELETE CASCADE
- created_by: UUID (FK → users.id) ON DELETE SET NULL
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- completed_at: TIMESTAMP
```

#### Comments
```sql
- id: UUID (PK)
- content: TEXT NOT NULL
- task_id: UUID (FK → tasks.id) ON DELETE CASCADE
- user_id: UUID (FK → users.id) ON DELETE SET NULL
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

---

## Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Kylexvin/taskflow-backend.git
cd taskflow-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Configure environment variables
# Edit .env with your database credentials

# 5. Create database and run schema
psql -U postgres -c "CREATE DATABASE taskflow;"
psql -U postgres -d taskflow -f database/schema.sql
psql -U postgres -d taskflow -f database/seed.sql

# 6. Start server
npm run dev
```

---

## Environment Variables

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow
JWT_SECRET=your_super_secret_jwt_key_here
```

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `DB_USER` | PostgreSQL username | Yes |
| `DB_PASSWORD` | PostgreSQL password | Yes |
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_PORT` | PostgreSQL port | Yes |
| `DB_NAME` | Database name | Yes |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Yes |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Users
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/users` | Get all users | Yes | Admin |
| GET | `/api/users/:id` | Get user by ID | Yes | - |
| PUT | `/api/users/:id` | Update user | Yes | - |
| DELETE | `/api/users/:id` | Delete user | Yes | Admin |

### Projects
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | Get all projects | Yes |
| GET | `/api/projects/:id` | Get project by ID | Yes |
| POST | `/api/projects` | Create project | Yes |
| PUT | `/api/projects/:id` | Update project | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes |

### Tasks
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tasks` | Get all tasks | Yes |
| GET | `/api/tasks/:id` | Get task by ID | Yes |
| GET | `/api/tasks/project/:projectId` | Get tasks by project | Yes |
| POST | `/api/tasks` | Create task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |

### Comments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/comments/task/:taskId` | Get comments for task | Yes |
| POST | `/api/comments` | Add comment | Yes |
| DELETE | `/api/comments/:id` | Delete comment | Yes |

### Dashboard
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Yes |

---

## API Documentation

### Authentication Examples

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe",
    "role": "user"  # optional (default: user)
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "securePassword123"
}
```

**Response:**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user"
    }
}
```

### Protected Endpoint Example

```bash
GET /api/projects
Authorization: Bearer <your_token>
```

### Create Task Example
```bash
POST /api/tasks
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "title": "Implement authentication",
    "description": "Add JWT authentication to the API",
    "status": "todo",
    "priority": "high",
    "story_points": 8,
    "due_date": "2026-07-15",
    "assignee_id": "user_uuid",
    "project_id": "project_uuid"
}
```

### Add Comment Example
```bash
POST /api/comments
Authorization: Bearer <your_token>
Content-Type: application/json

{
    "content": "I'll start working on this tomorrow",
    "task_id": "task_uuid"
}
```

### Dashboard Statistics
```bash
GET /api/dashboard/stats
Authorization: Bearer <your_token>
```

**Response:**
```json
{
    "total_users": 4,
    "total_projects": 1,
    "total_tasks": 4,
    "todo_tasks": 1,
    "in_progress_tasks": 1,
    "review_tasks": 1,
    "done_tasks": 1,
    "blocked_tasks": 0
}
```

---

## Project Structure

```
taskflow-backend/
├── src/
│   ├── config/
│   │   └── db.js              # PostgreSQL connection
│   ├── models/
│   │   ├── userModel.js       # User queries
│   │   ├── projectModel.js    # Project queries
│   │   ├── taskModel.js       # Task queries
│   │   └── commentModel.js    # Comment queries
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── userController.js  # User logic
│   │   ├── projectController.js # Project logic
│   │   ├── taskController.js  # Task logic
│   │   ├── commentController.js # Comment logic
│   │   └── dashboardController.js # Stats logic
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── commentRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   └── errorHandler.js   # Error handling
│   └── app.js                # Entry point
├── database/
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Seed data
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## Testing with Postman

Import the Postman collection:

1. Open Postman
2. Click "Import"
3. Select `TaskFlow.postman_collection.json` from the project
4. Set `BASE_URL` variable to `http://localhost:5000`

### Test Flow

1. **Register** - `/api/auth/register`
2. **Login** - `/api/auth/login` (copy token)
3. **Add token** to Authorization header: `Bearer <token>`
4. **Create Project** - `/api/projects`
5. **Create Task** - `/api/tasks`
6. **Add Comment** - `/api/comments`
7. **Get Dashboard** - `/api/dashboard/stats`

---

## What I Learned

### PostgreSQL vs MongoDB

| Aspect | PostgreSQL | MongoDB |
|--------|-----------|---------|
| **Schema** | Fixed schema with tables | Flexible schema with documents |
| **Query Language** | SQL | MongoDB Query Language |
| **Relationships** | Foreign keys with constraints | References or embedded |
| **Transactions** | ACID transactions | Multi-document transactions |
| **Use Cases** | Structured data, reporting | Unstructured data, rapid dev |

### PostgreSQL Key Concepts

- **Parameterized Queries** (`$1, $2`) - SQL injection prevention
- **Foreign Keys** - Data integrity with `ON DELETE CASCADE/SET NULL`
- **Indexes** - Query optimization
- **UUID** - Primary keys with `uuid_generate_v4()`
- **LEFT JOIN** - Combine tables while preserving data
- **Aggregation** - `COUNT()`, `GROUP BY`, subqueries

### Backend Best Practices

- **Model-Controller-Route Pattern** - Separation of concerns
- **JWT Authentication** - Stateless authentication
- **Role-Based Access Control** - Authorization layers
- **Error Handling Middleware** - Centralized error management
- **Environment Variables** - Configuration management

---

## License

MIT License - feel free to use this project for learning and production.

---

## Author

**Kylexvin**

Built as part of learning PostgreSQL with Node.js.

---

## Acknowledgments

- PostgreSQL for reliable relational database
- Express for clean routing
- JWT for secure authentication
```

---

## Step 2: Create `API.md`

**`API.md`**

```markdown
# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### Health Check
```
GET /health
```

**Response:**
```json
{
    "status": "OK",
    "timestamp": "2026-06-30T..."
}
```

---

### Authentication

#### Register
```
POST /auth/register
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "user"  // optional
}
```

**Response (201):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user"
    }
}
```

**Errors:**
- `400` - User already exists
- `500` - Server error

---

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user"
    }
}
```

**Errors:**
- `401` - Invalid email or password
- `500` - Server error

---

### Projects

#### Get All Projects
```
GET /projects
```

**Response (200):**
```json
[
    {
        "id": "uuid",
        "name": "TaskFlow Pro Development",
        "description": "Building the ultimate task management system",
        "status": "active",
        "priority": "medium",
        "created_by": "uuid",
        "created_by_name": "Admin User",
        "created_at": "2026-06-30T..."
    }
]
```

---

#### Create Project
```
POST /projects
```

**Request Body:**
```json
{
    "name": "New Project",
    "description": "Project description",
    "status": "planning",
    "priority": "high",
    "start_date": "2026-07-01",
    "end_date": "2026-12-31"
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "name": "New Project",
    "description": "Project description",
    "status": "planning",
    "priority": "high",
    "start_date": "2026-07-01",
    "end_date": "2026-12-31",
    "created_by": "uuid",
    "created_at": "2026-06-30T..."
}
```

---

### Tasks

#### Get All Tasks
```
GET /tasks
```

**Response (200):**
```json
[
    {
        "id": "uuid",
        "title": "Design Database Schema",
        "description": "Create all tables and relationships",
        "status": "done",
        "priority": "high",
        "story_points": 5,
        "due_date": null,
        "assignee_id": "uuid",
        "assignee_name": "John Doe",
        "project_id": "uuid",
        "project_name": "TaskFlow Pro Development",
        "created_by": "uuid",
        "created_by_name": "Admin User",
        "created_at": "2026-06-30T..."
    }
]
```

---

#### Create Task
```
POST /tasks
```

**Request Body:**
```json
{
    "title": "Implement authentication",
    "description": "Add JWT authentication to the API",
    "status": "todo",
    "priority": "high",
    "story_points": 8,
    "due_date": "2026-07-15",
    "assignee_id": "user_uuid",
    "project_id": "project_uuid"
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "title": "Implement authentication",
    "description": "Add JWT authentication to the API",
    "status": "todo",
    "priority": "high",
    "story_points": 8,
    "due_date": "2026-07-15",
    "assignee_id": "user_uuid",
    "project_id": "project_uuid",
    "created_by": "uuid",
    "created_at": "2026-06-30T..."
}
```

---

#### Update Task
```
PUT /tasks/:id
```

**Request Body:**
```json
{
    "status": "in_progress",
    "priority": "critical"
}
```

**Response (200):**
```json
{
    "id": "uuid",
    "title": "Implement authentication",
    "status": "in_progress",
    "priority": "critical",
    ...
}
```

---

### Comments

#### Get Comments for Task
```
GET /comments/task/:taskId
```

**Response (200):**
```json
[
    {
        "id": "uuid",
        "content": "I'll start working on this tomorrow",
        "task_id": "uuid",
        "user_id": "uuid",
        "user_name": "John Doe",
        "user_email": "john@taskflow.com",
        "created_at": "2026-06-30T..."
    }
]
```

---

#### Create Comment
```
POST /comments
```

**Request Body:**
```json
{
    "content": "Great progress, keep it up!",
    "task_id": "task_uuid"
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "content": "Great progress, keep it up!",
    "task_id": "task_uuid",
    "user_id": "uuid",
    "created_at": "2026-06-30T..."
}
```

---

### Dashboard

#### Get Statistics
```
GET /dashboard/stats
```

**Response (200):**
```json
{
    "total_users": 4,
    "total_projects": 2,
    "total_tasks": 12,
    "todo_tasks": 3,
    "in_progress_tasks": 4,
    "review_tasks": 2,
    "done_tasks": 3,
    "blocked_tasks": 0
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## Error Response Format

```json
{
    "error": "Error message description",
    "message": "Detailed error message (development only)"
}
```

---

## Rate Limiting

Currently not implemented. Rate limiting can be added with `express-rate-limit` middleware.

---

## Pagination

Currently not implemented. Consider adding `limit` and `offset` query parameters for large datasets.
```

---

## Step 3: Update `package.json`

Add these scripts:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```



## Step 4: Push Documentation


git add README.md API.md package.json
git commit -m "Add comprehensive documentation: README with schema, API docs, and project structure"
git push



| **Skill Demonstrated** | **In This Project** |
|---|---|
| PostgreSQL | ✅ Schema design, queries, joins, constraints, indexes |
| Node.js | ✅ Express, middleware, routing |
| Authentication | ✅ JWT, bcrypt password hashing |
| Authorization | ✅ Role-based access (admin/manager/user) |
| Database Design | ✅ ERD, foreign keys, UUID, cascading deletes |
| Security | ✅ SQL injection prevention, environment variables |
| Error Handling | ✅ Centralized error middleware |
| Project Structure | ✅ MVC pattern, separation of concerns |
| Documentation | ✅ README, API docs, Postman collection |
| Version Control | ✅ Git, GitHub |

