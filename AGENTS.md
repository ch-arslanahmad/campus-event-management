# AGENTS.md

## The brief is read-only

- `cloud-mini-project.md` = instructor's assignment brief. Never edit, move, or reformat it.
- Only source of truth for requirements. All other `.md` files are derived — conform to the brief, never the reverse.
- Brief §2 (stack) and §8 (folder structure) are suggestions. Only §27 is a hard rule: no solo work; instructor grades per-student GitHub evidence (commits, branches, issues, PRs, reviews).
- Grading & deliverables: brief §20 (repo contents), §21 (README requirements), §26 (marks).

## Decisions

Architecture decisions live in `documentation/adr/`. Read them before "fixing" stack, structure, or doc layout:

- ADR-0001: Backend Spring Boot/Java (brief suggests Node/Flask/Django — deviation is intentional), frontend React, DB MySQL, Java 17+.
- ADR-0002: JWTs live in httpOnly cookies, not localStorage (full-cookie auth: access + rotated refresh, one-origin deploy). Guide: `documentation/JWT-STORAGE.md`.

## Current state

- Backend is implemented: Spring Boot + Spring Data JPA on MySQL. Entities, repositories, services and cookie auth live in `backend/src/main/java/com/events/eventmanagement/`.
- Schema and demo data: `backend/database/schema.sql` + `seed.sql` (100 users, 555 events, 1000 registrations).
- Frontend exists under `frontend/` (React + Vite).
- CI on every PR into `main`: `.github/workflows/ci.yml` (backend `mvnw verify` on a seeded MySQL 8.4 service, frontend lint/test/build, plus a check that the PR body has a `Closes #N` line). PR template lives in `.github/pull_request_template.md`.
- `screenshots/` is still absent — a graded deliverable (brief §20).
- Local DB setup, demo accounts: `documentation/SETUP.md`.
- Server-side pagination (ADR-0003, issue #15) is not implemented yet.

## Documentation conventions

- Detailed docs live in `documentation/` (`SETUP.md`, `adr/`). Root holds only `README.md`, `CONTRIBUTING.md`, `LICENSE`, `.gitignore`, brief, `AGENTS.md`.
- `CONTRIBUTING.md` stays root — GitHub auto-detects it for PR flow.
- Keep `AGENTS.md` and derived docs in sync with reality whenever structure, commands, stack, or workflow change.
- New docs (API docs, DB docs, guides) → `documentation/`, linked from README.

## Conventions

- Branch flow per CONTRIBUTING.md: issue → `feature/*` → PR → lead review → merge. Never push to `main`.
- Commit messages: brief §13 wants descriptive ("Add event registration API"); conventional prefixes (`feat:`/`fix:`) also acceptable — both count as meaningful.
- User's pods MCP memory is single-user (teammates can't see it). Team-shared knowledge belongs in repo files, not pods.
