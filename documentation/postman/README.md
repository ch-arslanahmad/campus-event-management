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

Then run the verification script, which prints a PASS/FAIL verdict for every check:

```shell
docker compose exec -T db mysql -ucampus -pcampus123 campus_events < documentation/postman/database-checks.sql
```

It covers seed counts and edge-case rows, referential integrity (orphans, duplicate registrations, oversubscription), schema constraint enforcement (run in a rolled-back transaction, so no data changes), and residue from API runs. The last recorded output is in `database-checks-output.txt` (34/34 checks passed on a fresh seed).

The script reads live data, so it needs no per-run ids. Run it before a collection run for a clean baseline: the collection inserts one account, and the seed user count check only passes on a fresh seed (`docker compose down -v`).

`compose.yaml` publishes MySQL on host port 3307 as well as the container port, so a desktop SQL client can connect to `127.0.0.1:3307`; everything above still runs inside the container and does not need that mapping.

## Headless run

If Newman is installed:

```shell
newman run "Campus Events API.postman_collection.json" -e "Campus Events Local.postman_environment.json" --reporters cli,json --reporter-json-export results.json
```

The recorded run is 44 requests and 46 assertions, all passing. `run.log` holds the database checks, the Newman summary and the database state after the run; `results.json` is the machine-readable export with session-cookie values redacted. Retain both for execution evidence.

## Frontend checks

`../QA-REPORT.md` covers the browser side. `../qa/frontend-smoke.cjs` reproduces it: Playwright drives search, filters, pagination, registration, protected routes, admin CRUD, admin filters and a 376px viewport, then prints PASS/FAIL per check.

## Findings

`../API.md` lists the observed contract. The 500 on 201-character `title`/`location` is fixed: the API now returns 400 with a field message, and the collection asserts it.
