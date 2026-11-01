# Frontend manual QA

**Date:** 2026-11-01  
**Environment:** Local Docker Compose stack at `http://localhost:5173`; seeded demo accounts.  
**Scope:** Search, category filters, pagination, registration and cancellation, protected routes, administrator event CRUD and filters, and responsive layouts.

## Results

| Area | Result | Observation |
| --- | --- | --- |
| Search | Pass | Searching `Resume and LinkedIn Clinic` returned 4 matching events. |
| Category filter | Pass | Selecting Workshops updated the URL to `?category=WORKSHOP` and returned 111 workshops. Combining the earlier search with Workshops showed the expected empty state. |
| Pagination | Partial | Opening `/events?page=1` returned results 13–24 and showed page 2 of 47. Repeatedly activating the visible Next button left the URL and page unchanged in this browser session, so button-driven pagination did not pass manual verification. |
| Registration | Pass | A student registered for the temporary QA event; the detail page showed the success message and available seats changed from 25 to 24. The event appeared in My events after its data loaded. |
| Cancellation | Pass | The student cancelled that registration; My events no longer listed it and the event detail page returned to 25 available seats. |
| Protected routes | Pass | A guest opening `/dashboard/events/new` was redirected to `/login`. A student opening `/dashboard` was redirected to `/my-events`. |
| Administrator create/edit | Pass | Created event 562 through the event form, edited its title, and saw the updated title on the dashboard and event detail page. |
| Administrator delete | Pending | The temporary event is still present. Deleting through the UI requires action-time confirmation. |
| Administrator filters | Not available | The administrator dashboard lists events in a paginated table but exposes no search or filter controls. |
| Responsive layouts | Partial pass | The public event list was viewed at 376 × 504 and 1250 × 710. The narrow view used the collapsed menu and a single-column event card layout; the wider view showed the multi-column grid. Administrator layouts were not checked at narrow width. |

## Follow-up

- Investigate the Next button: in the observed session, direct navigation to page 2 worked while repeated activation of the visible button did not advance the page.
- Decide whether administrator list filters are required; there are no such controls in the current dashboard.
- Finish the administrator delete check and remove the temporary test event after confirmation.

