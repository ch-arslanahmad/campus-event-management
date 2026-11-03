# Verified API contract

Base URL: `http://localhost:8080`. JSON requests and responses use `application/json`. Authentication uses an `HttpOnly` `jwt_token` cookie set by login/signup; send the cookie on protected calls. No bearer token is returned. Statuses below were checked against the local Docker stack on 2026-11-03.

## Auth

| Method and path | Auth | Verified statuses | Contract/data rules |
|---|---|---|---|
| `POST /api/auth/register` (alias `/api/signup`) | Public | 201, 400, 409 | Body: `name`, `email`, `password`. Creates STUDENT only. Success sets HttpOnly cookie and returns user without token. Duplicate email: 409 `Email already registered`; invalid required fields: 400. |
| `POST /api/auth/login` (alias `/api/login`) | Public | 200, 400, 401 | Body: `email`, `password`. Success sets HttpOnly `jwt_token`; body contains user, not token. Valid-length incorrect credentials return generic 401 `Invalid email or password`; malformed/too-short password is validation 400. |
| `GET /api/auth/me` | Cookie | 200, 401 | Returns current user. Missing or tampered cookie: 401. |
| `POST /api/auth/logout` | Public | 200 | Clears `jwt_token` with `Max-Age=0`; subsequent `/me` is 401. |

## Events

`GET /api/events` and `GET /api/events/{id}` are public. Mutations require an admin cookie; student gets 403 and anonymous caller gets 401.

| Method and path | Auth | Verified statuses | Contract/data rules |
|---|---|---|---|
| `GET /api/events` | Public | 200 | Page envelope: `content`, `page`, `size`, `totalElements`, `totalPages`, `first`, `last`. Verified `page=0&size=12` returns 12 rows and 555 total. Supports `category`, `createdBy`, `featured`, `from`, `q`, `page`, `size`. |
| `GET /api/events/{id}` | Public | 200, 404 | Returns one event; unknown id returns 404. |
| `POST /api/events` | Admin | 201, 400, 401, 403 | Body: nonblank `title`, `date` (`YYYY-MM-DD`), `time` (`HH:mm`), `location`, enum `category` (`SEMINAR`, `WORKSHOP`, `SPORTS`, `COMPETITION`, `CONFERENCE`, `CULTURAL`), positive integer `capacity`; optional `description`, `featured`. Owner comes from cookie; supplied `createdBy` is ignored. Success returns new `id`. Invalid category/case, missing fields, capacity 0, and a title or location over 200 characters return 400; overlong text returns `Title must be at most 200 characters` / `Location must be at most 200 characters`. |
| `PUT /api/events/{id}` | Owning admin | 200, 400, 401, 403, 404 | Same body rules as create, including the 200-character limit on title/location. Owning admin updates; another admin or student gets 403. |
| `DELETE /api/events/{id}` | Owning admin | 204, 401, 403, 404, 409 | Empty event deletion returns 204. Event with registrations returns 409 and is retained. |

## Registrations

| Method and path | Auth | Verified statuses | Contract/data rules |
|---|---|---|---|
| `POST /api/register` | Cookie | 201, 400, 401, 404, 409 | Body requires `eventId`; caller id comes from cookie, supplied `userId` is ignored. Success returns registration id. Null/missing event id: 400; missing event: 404; duplicate or full event: 409. |
| `GET /api/registrations` | Cookie | 200, 401 | Paginated envelope. Students see only their registrations; admins see registrations for events they created. `eventId` and `userId` filters narrow results and do not widen caller scope. |
| `DELETE /api/registrations/{id}` | Cookie | 204, 401, 403, 404 | Deletes caller's registration; admins may cancel registrations for their own events. Success returns empty 204. |

## Error handling and findings

Malformed JSON and missing required event fields return 400. Validation failures share one body shape: `{"status":400,"error":"Bad Request","message":"Validation failed.","fields":{"<field>":"<message>"}}`. A title or location over 200 characters returns 400 with `Title must be at most 200 characters` or `Location must be at most 200 characters`. Unexpected failures return 500 with `Unexpected server error.` and no SQL text.

See [issue #43](https://github.com/ch-arslanahmad/campus-event-management/issues/43) for the overlong-text fix and `postman/run.log` for the recorded run.
