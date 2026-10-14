# Backend — Campus Events

Spring Boot (Java 21, Maven) REST API. Stack decision: [ADR-0001](../documentation/adr/0001-spring-boot-backend.md).

> **Subject to change** — early development. Update this file in the same PR when things change.

## Commands

    ./mvnw spring-boot:run      # dev server on :8080 (Ctrl+C to stop)

## Structure

    backend/
    ├── pom.xml                      # deps (DB stack paused, see comment inside pom.xml)
    ├── src/main/java/com/events/eventmanagement/
    ├── src/main/resources/
    │   └── application.properties   # app config (DB block added at integration)
    └── database/                    # DB source-of-truth files

## Database setup

Own local DB per teammate. Same 3 files = same DB everywhere.

    database/
    ├── setup.sql    # create DB + user, once per machine
    ├── schema.sql   # tables
    └── seed.sql     # rows

### Setup (once)

1. Install [MySQL](https://dev.mysql.com/downloads/windows/installer/8.0.html).
2. Run `setup.sql`, `schema.sql`, `seed.sql` (in order)
3. Testing creds (local dev DB only, never production): `campus` / `campus123` in `application.properties`.
4. `./mvnw spring-boot:run`

Run `.sql` file:

    # Workbench: open file → ⚡ (nothing selected = whole file)
    # CLI:        mysql -u campus -p campus_events < database/schema.sql
    # PowerShell: Get-Content .\database\schema.sql -Raw | mysql -u campus -p campus_events

### Reset (DB broken / schema changed)

    DROP DATABASE campus_events;
    -- rerun all 3 files

Seed-only data, so reset always safe. Schema change announced in chat → everyone resets.

### SQL rules

Standard DDL only (`AUTO_INCREMENT`, `ENUM`, `VARCHAR`, `DATE`, `UNIQUE`, FK). Files start with `USE campus_events;`.

> DB stack in `pom.xml` + `application.properties` paused (dummy-data phase). Re-enable both together at integration.

## Notes

- Lombok: enable annotation processing in IDE
  (IntelliJ: Settings → Build, Execution, Deployment → Compiler → Annotation Processors → Enable)
- Branch flow: issue → feature/* → PR → review → merge (see /CONTRIBUTING.md)
