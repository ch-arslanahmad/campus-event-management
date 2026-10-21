# ADR-0002: JWT in httpOnly cookies, not localStorage

Status: Accepted (2026-10-19)

## Context

Auth must survive production, not demo. Client-side JWT has 2 homes:

- `localStorage`: XSS read token, send it elsewhere, valid till expiry. No expiry/rotation/revocation handling. Every request attach `Authorization: Bearer` by hand.
- `httpOnly` cookie: JS no see token, XSS theft dead. Browser handle expiry, attachment, transport flags. Cost: CSRF (needs SameSite + custom header) + credentialed CORS config in dev.

Full rationale (tiers, flow, token travel, SameSite mechanics) in `documentation/JWT-STORAGE.md`.

## Decision

- Single access JWT in an `httpOnly` cookie named `jwt_token`: 8 hour `Max-Age`, `Path=/`, `HttpOnly; SameSite=Lax`, `Secure` from config (`app.cookie.secure`). Token never in response body, never JS-readable.
- No refresh token. Brief does not require one (JWT itself is optional extra credit), and access-only keeps zero server-side token state. Re-login when the cookie expires.
- Login/register deliver token via `Set-Cookie` only. Frontend: `fetch(url, { credentials: "include" })`, identity from `GET /api/auth/me`.
- Prod one origin: nginx serve React build, reverse-proxy `/api` to Spring jar. Cookies first-party, no CORS in prod.

## Consequences

- CSRF defense: `SameSite=Lax` is the enforced wall, browser refuses to attach the cookie on cross-site POST. Frontend also sends `X-Requested-With` as defense depth, no server filter enforces it. Issue #9 "CSRF disabled" rule, written for Bearer, superseded.
- `CorsConfig`: `allowCredentials(true)` + explicit origins, never `*`. Dev fetch need `credentials: "include"` else browser ignore `Set-Cookie`, login seem work, later call 401.
- No rotation, no revocation. Logout clears the cookie; a copied cookie stays valid until expiry. Accepted risk at this scope.
- API test outside browser need cookie jar (`curl -c` / `-b`, Postman cookies).
- Cookie cap ~4KB, keep claim lean: id + role only.
- `documentation/JWT-STORAGE.md` = living guide, ADR = short stable record, no merge. Reversal = new ADR supersede this, no edit here.
