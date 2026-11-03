# Frontend QA

**Date:** 2026-11-03  
**Environment:** Local Docker Compose stack at `http://localhost:5173` (fresh `docker compose down -v` seed); seeded demo accounts.  
**Scope:** Search, category filters, pagination, registration and cancellation, protected routes, administrator event CRUD and filters, and responsive layouts.

## Results

| Area | Result | Observation |
| --- | --- | --- |
| Search | Pass | Searching `Resume and LinkedIn Clinic` returned 4 matching events and dropped the `page` parameter, so the result set starts at page 1. |
| Category filter | Pass | Selecting Workshops updated the URL to `?category=WORKSHOP` and returned 111 workshops. |
| Pagination | Pass | Next advanced to `/events?page=1` (the URL page index is zero-based) showing results 13–24 and `Page 2 of 47`. Previous returns to page 1 and is disabled there. |
| Registration | Pass | A student registered for `Street Food Carnival - Fall 2026`; the detail page showed `You’re registered for Street Food Carnival - Fall 2026.` |
| Cancellation | Pass | The student cancelled that registration from My events after confirming the dialog; the event no longer appeared in the list. |
| Protected routes | Pass | A guest opening `/dashboard/events/new` was redirected to `/login`. A student opening `/dashboard` was redirected to `/my-events`. |
| Administrator create/edit | Pass | Created an event through the form, saw the `Event created.` notice, and the new title appeared in the admin table. |
| Administrator delete | Pass | Deleting that event (no registrations) asked for confirmation, showed `Event deleted.`, and the row disappeared. Deleting an event with registrations is still rejected with `Event has registrations and cannot be deleted.` |
| Administrator filters | Pass | The dashboard exposes category chips, status chips and a search box. Searching an impossible term gives `0–0 of 0 events`; `Clear filters` restores `1–8 of 133 events`. |
| Responsive layouts | Pass | Public list and admin dashboard were checked at 376 × 504 and 1250 × 710. Neither page scrolls horizontally at 376px (`scrollWidth - innerWidth` was 0). |

The measurements above come from a scripted Chromium run, not a hand-driven session: `documentation/qa/frontend-smoke.cjs` prints a PASS/FAIL line per check. It needs Playwright installed ad hoc (`npm install --no-save playwright && npx playwright install chromium`) and a running stack.

## Automated checks

- `npm run lint`, `npm test` (8 tests), and `npm run build` pass locally.
- The Postman collection (44 requests, 46 assertions) passes in full against the current backend; see `documentation/postman/run.log`.
- The database checks (34 checks, 34 passed) run on a fresh seed and leave no rows behind; output in `documentation/postman/database-checks-output.txt`.

## Follow-up

- Playwright is not a project dependency, so the smoke script only runs after the ad hoc install above. Add it to `frontend/package.json` if it should run in CI.
- The URL page index is zero-based while the label is one-based (`?page=1` shows `Page 2`). This is consistent with the API but easy to misread; leave as is unless deep links matter.
- Overlong title/location now returns 400 with a field message (#43), covered by the Postman collection.
