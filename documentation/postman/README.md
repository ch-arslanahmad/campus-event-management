# Postman collection

## Import and prepare

1. In Postman, choose **Import** and import `Campus Events API.postman_collection.json` and `Campus Events Local.postman_environment.json`.
2. Select the **Campus Events Local** environment. It contains `baseUrl`, demo account emails, and the seeded demo password.
3. Start the stack from the repository root: `docker compose up -d`. Confirm services with `docker compose ps`.
4. Before each collection run, clear cookies for `localhost` in Postman. Login sets one `jwt_token` cookie for the host; signing in as a different user replaces it. Keep the Postman cookie jar enabled. Do not add a bearer token.
5. Use Collection Runner in request order. The tests are sequential because they create a temporary event and registration.

## Role sequence

- Start with no-cookie `/api/auth/me`, then log in as admin.
- Run public event browse/detail and admin create/update/validation requests. Create stores `eventId`.
- Log in as student `sidra.butt@gmail.com`. Register for the temporary capacity-one event, repeat for duplicate 409, then list registrations.
- Log in as admin `ayesha.khan.admin@gmail.com`. Register once for full-event 409 and try deleting the event for 409.
- Log back in as student and cancel using `registrationId`; log in as admin and delete the now-empty event (204).
- Run logout and the following `/me` request to confirm cookie clearing.
- For the different-admin ownership check, log in as `hamza.malik.admin@outlook.com`, then return to Ayesha for later owner-only requests.

## Database evidence

From PowerShell at the repo root, run baseline counts:

```powershell
docker compose exec -T db mysql -ucampus -pcampus123 campus_events -e "SELECT COUNT(*) AS events FROM events; SELECT COUNT(*) AS registrations FROM registrations; SELECT COUNT(*) AS users FROM users;"
```

The checked-in evidence uses seeded IDs so the SQL is runnable as-is:

```sql
SELECT id, created_by, title, capacity, category FROM events WHERE id = 1;
SELECT id, user_id, event_id FROM registrations WHERE id = 1;
SELECT COUNT(*) FROM events WHERE id = 1;
SELECT COUNT(*) FROM registrations WHERE id = 1;
```

Exact checks performed in this run are recorded in `run.log` and `database-checks.sql`. The SQL file is executable as-is and uses seeded IDs 1 for the event and registration checks.

## Headless run

If Newman is installed:

```shell
newman run "Campus Events API.postman_collection.json" -e "Campus Events Local.postman_environment.json" --reporters cli,json --reporter-json-export results.json
```

The collection includes checks related to the overlong text backend bug tracked in [issue #43](https://github.com/ch-arslanahmad/campus-event-management/issues/43). Retain terminal output and `results.json` for headless execution evidence.

## Findings

`../API.md` lists the observed contract. 201-character `title` and `location` values currently return 500 instead of a client validation response; this is tracked in [issue #43](https://github.com/ch-arslanahmad/campus-event-management/issues/43).
