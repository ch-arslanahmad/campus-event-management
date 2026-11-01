# Backend bug report draft — overlong event text returns 500

**Title:** `POST /api/events` and `PUT /api/events/{id}` return 500 when title/location exceeds 200 characters

**Observed:** With a valid admin cookie and otherwise valid payload, a 201-character `title` and, separately, a 201-character `location` each return HTTP 500 with `{"status":500,"error":"Internal Server Error","message":"Unexpected server error."}`. SQL/JDBC details do not leak.

**Expected:** Reject invalid input with HTTP 400 and a field validation message. The database columns have a 200-character limit; validate at the request boundary or map the constraint violation to a client error.

**Reproduction:**

1. Start `docker compose up -d` and log in as `ayesha.khan.admin@gmail.com` / `Demo@12345`.
2. Send `POST http://localhost:8080/api/events` with a valid event body and a `title` string of 201 characters.
3. Repeat with a valid `title` and 201-character `location`.
4. Both requests return 500.

**Evidence:** `documentation/postman/run.log`. This is a draft only; no GitHub issue has been filed.
