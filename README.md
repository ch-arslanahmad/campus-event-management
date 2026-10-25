# Campus Event Management System

A full-stack web application for managing university events. Students can discover, search, filter, and register for campus seminars, workshops, sports events, and competitions.

## Prerequisites

- Java 17+
- Node.js & npm
- MySQL server
- Git
- Any IDE(IntelliJ IDEA, VS Code, Zed)

## Project Structure

```
campus-event-management/
├── frontend/
│   └── src/
│       ├── components/
│       └── pages/
├── backend/
│   └── src/main/java/com/campus/event/
│       ├── controller/
│       ├── service/
│       ├── model/
│       ├── repository/
│       └── dto/
├── documentation/
│   ├── ERD.md
│   ├── ERD.png
│   ├── SETUP.md
│   ├── API.md
│   ├── JWT-STORAGE.md
│   └── adr/
│       ├── 0001-spring-boot-backend.md
│       └── 0002-jwt-in-httponly-cookies.md
├── .github/
│   ├── CODEOWNERS
│   ├── pull_request_template.md
│   └── workflows/
│       ├── ci.yml
│       └── opencode.yml
├── screenshots/
├── README.md
├── CONTRIBUTING.md
├── AGENTS.md
├── .gitignore
└── LICENSE
```

## Team Members

- Student 1 – Team Lead
- Student 2 – Frontend Developer
- Student 3 – Frontend Developer
- Student 4 – Backend Developer
- Student 5 – Database/Testing Developer

## Technologies

- Frontend: React.js, HTML5, CSS3
- Backend: Spring Boot (Java)
- Database: MySQL
- Version Control: Git & GitHub

## Features

- View and search events by keyword
- Filter events by category (Seminar, Workshop, Sports, Competition)
- User registration and login
- Event registration for students
- Admin panel for creating, updating, and deleting events
- Responsive UI
- RESTful APIs

## Installation

```
git clone https://github.com/ch-arslanahmad/campus-event-management.git
cd campus-event-management
```

Frontend:

```
cd frontend
npm install
npm start
```

Backend:

```
cd backend
mvn clean install
mvn spring-boot:run
```

See [documentation/SETUP.md](documentation/SETUP.md) for database configuration, deployment, and troubleshooting.

## Development Flow

Learn about the development flow in the [CONTRIBUTING.md](CONTRIBUTING.md)

## API Endpoints

- `GET /api/events` - List all events (public)
- `GET /api/events/:id` - Get event details (public)
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin, owner only)
- `DELETE /api/events/:id` - Delete event (admin, owner only)
- `POST /api/register` - Register for event (auth)
- `GET /api/registrations` - List registrations (auth, scoped to caller; `?eventId=` / `?userId=` narrow)
- `POST /api/auth/login` - User login (sets the auth cookie). The brief's path, `POST /api/login` (§6), works too.
- `POST /api/auth/register` - User signup (sets the auth cookie). The brief's path, `POST /api/signup` (§6), works too.
- `POST /api/auth/logout` - Clear auth cookies
- `GET /api/auth/me` - Current user, read from cookie

All list endpoints are paginated: `?page=` (0-based, default `0`) and `?size=` (default `20`, max `100`); they answer with `{content, page, size, totalElements, totalPages, first, last}`. Rules and rationale: [ADR-0003](documentation/adr/0003-server-side-pagination.md).

Better explaination would be in its (to be created ) API documentation file.

Auth is cookie-based (one httpOnly `jwt_token` cookie, no token in JSON). Design and rationale: [documentation/JWT-STORAGE.md](documentation/JWT-STORAGE.md) and [ADR-0002](documentation/adr/0002-jwt-in-httponly-cookies.md).

### Example Requests

_Request/response examples are still being collected. Demo accounts, database setup and how to run the backend are in [documentation/SETUP.md](documentation/SETUP.md)._

## Database Schema

Full schema: [backend/database/schema.sql](backend/database/schema.sql). Diagram: [documentation/ERD.md](documentation/ERD.md) ([PNG](documentation/ERD.png)). The lists below are a summary.

### Users Table

```
id (PK)
name
email (UNIQUE)
password
role (STUDENT, ADMIN)
created_at
```

Roles:

- `STUDENT`, views events, registers for them. The server assigns this at signup; the request body cannot choose a role.
- `ADMIN`, creates events; updates/deletes **only events it created** (checked via `created_by`). No global admin. Admin accounts come from seed data, not from public signup.

### Events Table

```
id (PK)
title
description
date
time
location
category (SEMINAR, WORKSHOP, SPORTS, COMPETITION, CONFERENCE, CULTURAL)
capacity (must be > 0)
featured (default false)
created_at
created_by (FK to Users)
```

### Registrations Table

```
id (PK)
user_id (FK to Users)
event_id (FK to Events)
registration_date
UNIQUE (user_id, event_id)
```

## License

MIT License, see [LICENSE](LICENSE).
