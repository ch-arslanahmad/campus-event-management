# Campus Event Management System — ERD (campus_events)

```mermaid
---
title: Campus Event Management System — ERD (campus_events)
---
erDiagram
    users ||--o{ events : "creates (created_by)"
    users ||--o{ registrations : "makes (user_id)"
    events ||--o{ registrations : "receives (event_id)"

    users {
        BIGINT id PK "AUTO_INCREMENT"
        VARCHAR_100 name "NOT NULL"
        VARCHAR_150 email UK "NOT NULL"
        VARCHAR_255 password "NOT NULL"
        ENUM role "STUDENT, ADMIN"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
    }

    events {
        BIGINT id PK "AUTO_INCREMENT"
        VARCHAR_200 title "NOT NULL"
        TEXT description
        DATE date "NOT NULL"
        TIME time "NOT NULL"
        VARCHAR_200 location "NOT NULL"
        VARCHAR_50 category "CHECK in 6 values"
        INT capacity "CHECK capacity > 0"
        BOOLEAN featured "DEFAULT FALSE"
        DATETIME created_at "DEFAULT CURRENT_TIMESTAMP"
        BIGINT created_by FK "NOT NULL"
    }

    registrations {
        BIGINT id PK "AUTO_INCREMENT"
        BIGINT user_id FK "NOT NULL"
        BIGINT event_id FK "NOT NULL"
        DATETIME registration_date "DEFAULT CURRENT_TIMESTAMP"
    }
```

## Legend

- **PK** primary key, **FK** foreign key, **UK** unique
- `||` = exactly one, `o{` = zero or many

## Constraints

- `users.role`: ENUM (`STUDENT`, `ADMIN`)
- `events.capacity`: CHECK (`capacity > 0`) — `chk_events_capacity`
- `events.category`: CHECK in (`SEMINAR`, `WORKSHOP`, `SPORTS`, `COMPETITION`, `CONFERENCE`, `CULTURAL`) — `chk_events_category`
- `registrations`: UNIQUE (`user_id`, `event_id`) — `uq_user_event`; junction table (users M:N events)
