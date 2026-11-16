# Backend

Spring Boot 4.1 (Java 21, Maven) REST API for Campus Event Management. It uses Spring Data JPA with MySQL, Spring Security for role checks and a JWT stored in an `HttpOnly` cookie. The stack choice is recorded in [ADR-0001](../documentation/adr/0001-spring-boot-backend.md).

## Run locally

The database must be available before starting the API. Follow the complete database instructions in [documentation/SETUP.md](../documentation/SETUP.md), then run:

```shell
./mvnw verify
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`. A running instance exposes health at `/actuator/health`.

## Structure

```
backend/
├── database/
│   ├── schema.sql                 # MySQL schema
│   └── seed.sql                   # 100 users, 555 events, 1000 registrations
├── src/main/java/com/events/eventmanagement/
│   ├── config/                    # security, JWT and CORS configuration
│   ├── controllers/               # HTTP endpoints
│   ├── dto/                       # request and response types
│   ├── models/                    # JPA entities
│   ├── repositories/              # Spring Data repositories
│   └── services/                  # application rules
└── src/main/resources/
    └── application.properties     # default local configuration
```

## Database and configuration

The local defaults connect to MySQL database `campus_events` as user `campus`. `schema.sql` owns the database structure and `seed.sql` loads the demo data. Hibernate never changes the schema.

For another environment, set `APP_DB_URL`, `APP_DB_USER` and `APP_DB_PASSWORD`. Set a strong `APP_JWT_SECRET` before deploying; the configured default is for local development only.

## API and testing

The API contract and observed status codes are in [documentation/API.md](../documentation/API.md). Import the Postman collection from [documentation/postman](../documentation/postman/README.md) to repeat the API checks. Cookie authentication, including its security trade-offs, is described in [documentation/JWT-STORAGE.md](../documentation/JWT-STORAGE.md).

## Team workflow

Work starts from an issue and moves through a feature branch, pull request and lead review. See [CONTRIBUTING.md](../CONTRIBUTING.md).

## Docker port mapping note

In `compose.yaml` the port syntax is **`host:container`**.

```yaml
ports:
  - "80:80"
```

- **80** (left) = published (host) port — the one you type in the browser (`http://localhost`).
- **80** (right) = container port — where nginx actually listens inside the container.

Backend (`127.0.0.1:8080:8080`) and db (`127.0.0.1:3307:3306`) bind to localhost only; only the frontend publishes on all interfaces, since it is the public entry point.

This is a common source of confusion; keep the order `host:container` in mind when editing the compose file or adding new ports.
