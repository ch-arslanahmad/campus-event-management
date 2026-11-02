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

It covers seed counts and edge-case rows, referential integrity (orphans, duplicate registrations, oversubscription), schema constraint enforcement (run in a rolled-back transaction, so no data changes), and cleanup of the temporary rows from the recorded run. The last recorded output is in `database-checks-output.txt` (34/34 checks passed).

For a new run, set `@event_id` and `@registration_id` at the top of section 5 to the ids returned by the API, and add the row checks for those ids as shown in `run.log`.

## Headless run

If Newman is installed:

```shell
newman run "Campus Events API.postman_collection.json" -e "Campus Events Local.postman_environment.json" --reporters cli,json --reporter-json-export results.json
```

The collection includes checks related to the overlong text backend bug in `BUG-REPORT-DRAFT.md`; fix/report it before treating the run as fully passing. Retain terminal output and `results.json` for headless execution evidence.

## Findings

`../API.md` lists the observed contract. 201-character `title` and `location` values currently return 500 instead of a client validation response. See `BUG-REPORT-DRAFT.md`.
