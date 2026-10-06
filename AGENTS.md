# AGENTS.md

## The brief is read-only

- `cloud-mini-project.md` = instructor's assignment brief. Never edit, move, or reformat it.
- Only source of truth for requirements. All other `.md` files are derived — conform to the brief, never the reverse.
- Brief §2 (stack) and §8 (folder structure) are suggestions. Only §27 is a hard rule: no solo work; instructor grades per-student GitHub evidence (commits, branches, issues, PRs, reviews).
- Grading & deliverables: brief §20 (repo contents), §21 (README requirements), §26 (marks).

## Decisions

Architecture decisions live in `documentation/adr/`. Read them before "fixing" stack, structure, or doc layout:

- ADR-0001: Backend Spring Boot/Java (brief suggests Node/Flask/Django — deviation is intentional), frontend React, DB MySQL, Java 17+.

## Current state

- No application code: `frontend/`, `backend/`, `screenshots/` absent. All are graded deliverables (brief §20).
- README describes intended architecture + API surface from brief §6/§7 — not yet implemented code.
- Example API request bodies: placeholder, pending backend implementation.

## Documentation conventions

- Detailed docs live in `documentation/` (`SETUP.md`, `adr/`). Root holds only `README.md`, `CONTRIBUTING.md`, `LICENSE`, `.gitignore`, brief, `AGENTS.md`.
- `CONTRIBUTING.md` stays root — GitHub auto-detects it for PR flow.
- Keep `AGENTS.md` and derived docs in sync with reality whenever structure, commands, stack, or workflow change.
- New docs (API docs, DB docs, guides) → `documentation/`, linked from README.

## Conventions

- Branch flow per CONTRIBUTING.md: issue → `feature/*` → PR → lead review → merge. Never push to `main`.
- Commit messages: brief §13 wants descriptive ("Add event registration API"); conventional prefixes (`feat:`/`fix:`) also acceptable — both count as meaningful.
- User's pods MCP memory is single-user (teammates can't see it). Team-shared knowledge belongs in repo files, not pods.
