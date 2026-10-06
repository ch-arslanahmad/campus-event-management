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
│   ├── SETUP.md
│   └── adr/
│       └── 0001-spring-boot-backend.md
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

- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)
- `POST /api/register` - Register for event
- `GET /api/registrations` - List registrations
- `POST /api/login` - User login
- `POST /api/signup` - User registration

### Example Requests

_Not yet available — backend not implemented. Will be filled with real requests/responses once APIs are built (subject to change)._

## Database Schema

### Users Table

```
id (PK)
name
email
password
role (STUDENT, ADMIN)
```

### Events Table

```
id (PK)
title
description
date
time
location
category
capacity
created_by (FK to Users)
```

### Registrations Table

```
id (PK)
user_id (FK)
event_id (FK)
registration_date
```

## License

MIT License — see [LICENSE](LICENSE).
