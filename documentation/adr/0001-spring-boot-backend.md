# ADR-0001: Backend = Spring Boot (Java)

Status: Accepted — 2026-10-06

## Context

Brief §2 ("Suggested Technology Stack") lists Node+Express, Flask, Django for backend. Heading says "Suggested"; only §27 is a hard rule. Stack deviation allowed with justification.

## Decision

- Backend: Spring Boot (Java), minimum Java 17 (Spring Boot 3.x/4.x system requirement — verified against docs.spring.io).
- Frontend: React.
- Database: MySQL.

## Consequences

- Justification for instructor demo: "Brief suggested Node/Flask/Django; we chose Spring Boot as agreed with instructor."
- All 5 team members must be able to contribute Java — confirm agreement before heavy backend work starts.
- Repo structure uses Java/Spring paths (`controller/service/repository`) — not Express-style (`routes/controllers`). Do not "correct" either doc to match the brief's suggestion.
