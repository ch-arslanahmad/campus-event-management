# Where should the JWT live? Cookie or localStorage

## Decision on record:

full-cookie, single access JWT in an `httpOnly` cookie named `jwt_token`. No refresh token: brief does not require one (JWT itself is optional extra credit), and access-only keeps zero server-side token state. Prod: one origin, same domain, no CORS.

## Scope:

one question only, where a browser holds the JWT. localStorage or Cookie?

---

## Glossary

- **JWT**: server-signed token. Holder of valid token is a user. No server session lookup, token carry identity itself. That = "stateless".
- **Why storage question exist.** JWT = _bearer_ credential, access go whoever carry it. Real question never "cookie vs localStorage" in abstract. It = **"who carry token, can attacker become that carrier?"**
- **XSS (Cross-Site Scripting).** Attacker run _their_ JS on _your_ page, via injected comment, compromised npm dep, unsafe `dangerouslySetInnerHTML`. Script read, script ship attacker server.
- **CSRF (Cross-Site Request Forgery).** Attacker site trick _your browser_, fire request at _your API_. Browser attach auth cookie auto, request land authenticated. Attacker never see token, just ride your browser.
- **Two browser switches.** `httpOnly` = JS no read cookie, kill XSS _theft_. `SameSite` = browser refuse cookie on cross-site request, kill most CSRF.

Split hold onto: XSS = reading, CSRF = sending, each switch cover 1 side. localStorage to cookie swap one enemy for other, no end fight.

## Flow, end to end

Running example: this project, React SPA front Spring Boot API.

1. **Login.** `POST /api/auth/login`, email + password. Server validate, mint 1 JWT (id + role claim), return the `Set-Cookie` header only. JSON body no token for JS find. Access live 8 hour.
2. **Browser store it**, own cookie rule: `HttpOnly; SameSite=Lax; Secure` (prod). Any script `document.cookie` come back empty.
3. **Every request.** Frontend write `fetch(url, { credentials: "include" })`, forget auth. No header helper, no interceptor. Browser attach cookie self, it check SameSite/Secure/Path for you. Server filter parse + verify access token, mark request authenticated.
4. **Access expire.** Tab open past 8 hour, next request 401, frontend redirect to login. This project has no refresh token, so no silent re-auth and no server-side rotation state.
5. **Logout.** `POST /api/auth/logout`, clear cookie. A copied cookie stays valid until expiry. Accepted risk for this project, no server state to revoke.

What each attack get:

- **XSS no take credential home.** Fire request _in live page_, unavoidable, page compromised, but `document.cookie` empty. Nothing exfiltrate, nothing replay tomorrow. Short access TTL cap live-page hijack use.
- **CSRF no get sent.** Cross-site POST from `evil.com` reach API _without_ cookie, `SameSite=Lax` hold back. Extra armor too: frontend send a custom header (`X-Requested-With`) that cross-origin HTML form no set. Not enforced server-side.

## Where token travels, call by call

**JWT return in API call?** Login/register: yes, must reach client somehow.

Every other call: no, never re-issue.

|                  | localStorage style                         | full-cookie style                                                |
| ---------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| Login response   | `{"token": "eyJ…"}` **in JSON body**       | token **in `Set-Cookie` response header**; body carry _no_ token |
| Who put away     | your JS: `localStorage.setItem`            | **browser**, auto                                                |
| Every later call | your code attach `Authorization: Bearer …` | browser attach `Cookie:` for you                                 |

Cookie style: token _is_ return, just header JS no see. "Session cookie" here = **browser cookie jar**, not server session, not JS `sessionStorage`. `Max-Age` set → technically _persistent_ cookie. No server-side state, nothing to kill early: the cookie dies on its own.

Individual call after login, boring by design:

```text
fetch("/api/registrations", { credentials: "include" })
  → browser checks its jar: cookie matches host/path/SameSite/Secure?
  → yes → attaches Cookie: jwt_token=eyJ… automatically
  → server verifies signature + expiry → request proceeds
  → response: normal JSON, no Set-Cookie, token NOT re-issued
```

- **No cookie in jar = 401.** Everything except `/api/auth/login` and `/api/auth/register` is protected, `GET /api/events` included. Browsing events needs a cookie. Fresh/incognito browser, other tool: same 401.
- **Outside browser**: curl/Postman no manage jar alone. `curl -c cookies.txt` login to _save_, `-b cookies.txt` later call to _send_. Why curl test 401, webapp work.
- **Access expire?** 401, frontend redirect to login. No refresh token here, nothing to retry. Nobody ever read token.

Classic dev bug: cross-_origin_ call (`localhost:5173` → `8080`), fetch must set `credentials: "include"`. Default `'same-origin'` → browser **ignore `Set-Cookie`** on cross-origin response: login appear success, nothing store, later call go cookie-less, mystery 401. Same reason CORS need `allowCredentials(true)` + explicit origin, `*` response get reject.

---

## Actual tradeoff

|                             | JWT in localStorage                                     | JWT in httpOnly cookie                                                                |
| --------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **XSS steal credential?**   | **Yes.** Any script read, exfiltrate, valid till expiry | No. JS no see it (XSS still _act_ as user while page live, but no walk away with key) |
| **CSRF risk?**              | None. Nothing auto-send                                 | **Yes.** Browser attach auto, SameSite + CSRF defense required                        |
| **Expiry / rotation**       | Manual, often "never"                                   | Browser-enforced `Max-Age`, rotation easy                                             |
| **Auto-attach on request**  | No. You wire `Authorization: Bearer` header self        | Yes, free                                                                             |
| **Survive browser restart** | Yes                                                     | Yes                                                                                   |

Symmetry matter: cookie trade XSS-theft for CSRF, localStorage trade CSRF for XSS-theft. Cookie + `SameSite=Lax` + custom-header check = stronger combo, CSRF defense straightforward, XSS token exfiltration no stoppable from token side.

## 3 real options for JWT in browser

**1. httpOnly cookie, default when _you_ own API**

- XSS no exfiltrate; rotate/revoke via refresh just work; browser handle expiry + attach
- Cost: CSRF inherit (mitigate `SameSite=Lax` + custom header), CORS must `allowCredentials`, cookie cap ~4KB → claim lean
- OWASP recommend default for browser-held token

**2. localStorage hold JWT, only these case**

- **Third-party API no control.** Call GitHub/Stripe from browser: their token response no become _your_ origin httpOnly cookie → _forced_ hold in JS
- **Cross-site split deploy, third-party cookie get blocked** (Safari ITP, Firefox ETP, Chrome third-party restriction). `SameSite=None` cookie cap/block there. 1 real-world architecture reason SPA still ship JWT localStorage, one-origin design sidestep
- **Demo/prototype, low stake** where cookie+CSRF setup no worth it
- **If must:** access TTL in _minutes_ no days, tight CSP + output shrink XSS surface, accept "stolen = valid till expiry" residual risk
- **Never for:** long-lived token, admin/high-privilege role, sensitive PII claim

**3. In-memory (JS variable)**

- Smallest XSS window, nothing persist, but die reload → need silent re-auth. Only useful as hybrid access half.

## Decision matrix

| Situation                                          | Hold JWT in                                    |
| -------------------------------------------------- | ---------------------------------------------- |
| You own API, 1 origin / own subdomain              | **httpOnly cookie**                            |
| Long session, rotate/revoke need                   | **httpOnly cookie**                            |
| High-privilege token (admin action)                | **httpOnly cookie**                            |
| Third-party API no control                         | localStorage (memory if reload survive unneed) |
| Frontend/backend diff site, 3rd-party cookie block | localStorage fallback, or redesign 1 origin    |
| Quick demo, low stake                              | localStorage fine                              |
| Want XSS-minimal **and** reload survive, own API   | hybrid: in-memory access + cookie refresh      |

This project lands row 1: first-party Spring API, one-origin deploy, full-cookie, no hesitation.

## Security tiers

```text
Worst:             HTTP, no expiry, secrets in localStorage
Acceptable (low-value):  HTTPS + short-lived JWT + localStorage + CSP + minimal deps
Better (high-value):     HTTPS + short-lived access token in memory + refresh token in
                         HttpOnly/Secure/SameSite cookie + rotation + CSRF protection on
                         the refresh endpoint + CSP
```

CSP cut XSS odd, no remove.

Two small notes bolt on:

1. Cookie tier assume browser-only client. Add mobile app / third-party API consumer → refresh-in-cookie design break, no browser hold cookie. Those client use Bearer token + platform secure storage, high-value app often run both scheme.
2. Rotation need server-side state (refresh-token family / revocation list), quietly reintroduce server state. Fine, just know "stateless JWT" purity gone top tier.

Example setup sit top tier: HTTPS at proxy, 15-min access token, rotated refresh, full-cookie, CSRF defense. No mobile/third-party consumer, browser-only assumption hold.

## Hybrid alternative (not chosen)

```
access token  → in-memory JS variable   (dies on refresh; XSS can only use it live)
refresh token → httpOnly cookie         (never touches JS; rotated on use)
```

Nothing durable XSS steal, CSRF surface limit 1 endpoint (`/api/auth/refresh`), silent re-auth. More frontend plumbing than full-cookie, full-cookie never expose access token JS at all, lose here.

## What actually matter: long-lived credential

Real question no = where short-lived JWT live (localStorage, cookie). Real question = where long-lived credential live. Short expiry on access token only limit damage if refresh token no stealable. Low-value app: localStorage both = accepted risk. High-value data: refresh token HttpOnly + Secure + SameSite cookie, scope refresh endpoint → XSS act in-page but no steal credential, no replay off-site. Access token memory/localStorage matter much less. Here one access cookie: stricter, XSS no read it.

Amateur marker no = storage choice. Real markers:

- No HTTPS, token cleartext. Truly amateur part.
- No token expiry
- No server-side validation
- Password/sensitive data (not just session token) in localStorage
- No CSP, no input sanitization → XSS happen first place

## Why not localStorage for JWTs

- **XSS = full account takeover.** Any injected script read + exfiltrate token. `httpOnly` cookie invisible JS.
- **No auto expiry, no rotation, no revoke.** Token sit till someone clear, logged-out user still authed on refresh.
- **Client manage auth by hand:** attach `Authorization: Bearer` every fetch, handle 401 + redirect. Cookie browser do free.

## What cookie do for you (browser mechanic, beyond auth debate)

1. **HttpOnly = invisible JS.** `Set-Cookie: token=abc; HttpOnly; Secure; SameSite=Lax`, JS on page no read. XSS payload run `document.cookie`, token no there. Big security 1.
2. **Auto: browser send, no code needed.** localStorage world your code remember, every time: ``fetch('/api/events', { headers: { Authorization: `Bearer ${token}` } })``. Cookie go every same-site request by self: fetch, image, `<a>` navigation, form post, CSS file, websocket. No "forgot attach header" bug class, work non-JS page load too, plain server-rendered link click carry auth. localStorage no do that, request no made by your JS → no token.
3. **Server control lifetime.** `Set-Cookie: token=...; Max-Age=900` → browser delete after 15 min. Server decide, client no extend own session edit storage.
4. **Browser enforce transport rule.** Secure → browser refuse send over HTTP. SameSite=Lax/Strict enforce cross-site rule native. Domain/Path scope keep cookie where you say. You write policy 1 time, browser = enforcement engine; Bearer header your JS reimplement all that every request.
5. **No frontend auth code at all.** Login set cookie, every request authenticated. No localStorage.setItem, no header helper, no axios interceptor. Less JS = less to get wrong.

---

## Where this applies in this project

Scenario: campus-events SPA, React + Vite `localhost:5173` dev talk Spring Boot API `localhost:8080`. Prod nginx serve React build + reverse-proxy `/api` to jar, all 1 origin.

Map real code:

- **Backend:** `AuthController` own `/api/auth/login`, `/register`, `/logout`, `/me`, login/register _set cookie_ no echo token JSON. `JWTFilter` (Spring `OncePerRequestFilter`) read **cookie**, no `Authorization: Bearer` header, verify access token, mark request authenticated.
- **Config property, no hardcode:** `app.jwt.secret` (env, never commit), `app.cookie.secure=false` dev / `true` prod, `app.cors.allowed-origins` dev origin.
- **Frontend:** 1 shared `fetch` wrapper `credentials: "include"`, identity from `GET /api/auth/me`, never parse token.
- **Prod:** nginx one-origin, cookie first-party, CORS disappear entirely.

### Cookie: the access JWT (`jwt_token`)

- `POST /api/auth/login` + `POST /api/auth/register` **set cookie, never token in JSON**:

  ```
  Set-Cookie: jwt_token=<jwt>; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800; Secure
  ```

- Access live 8 hour (`Max-Age=28800`). No refresh token, no rotation, no server-side token table. Brief does not require it.
- Frontend never read JWT: `fetch(url, { credentials: "include" })` + `GET /api/auth/me` identity.
- `POST /api/auth/logout` clear cookie.
- `Secure` flag from config (`app.cookie.secure=false` local, `true` prod), plain-http localhost no break.

### localStorage: no for JWT

Placeholder/UI data only (issues 001/011/012). Rule: hurt attacker read, never localStorage.

---

## SameSite on localhost (correction record)

| Test                        | `localhost:5173` → `localhost:8080`            | `app.example.com` → `api.other.com` |
| --------------------------- | ---------------------------------------------- | ----------------------------------- |
| Same **origin**?            | No, port differ                                | No                                  |
| Same **site**?              | **Yes.** Site = scheme + host, **port ignore** | No                                  |
| CORS apply?                 | Yes                                            | Yes                                 |
| `SameSite=Lax` cookie send? | **Yes**                                        | No, need `None; Secure`             |

- **Same-origin** = scheme + host + **port**, port differ here → CORS still apply. Why `CorsConfig` exist.
- **Same-site** = scheme + registrable domain, port ignore. Both URL `http://localhost`, same site.
- `SameSite` restrict only **cross-site** request. `localhost:5173` → `localhost:8080` = same-_site_ → **`Lax` cookie send normal**, even `fetch`. `None` only genuinely diff registrable domain.
- Cookie ignore port fully: `localhost:8080` cookie belong host `localhost`, no port.

## Deployment (prod)

- **1 origin:** nginx serve React build + proxy `/api` → Spring jar `:8080`. First-party cookie, **zero CORS**, `Lax` work everywhere.
- Dev CORS: explicit origin + `allowCredentials(true)`, never `*`, reject when credential on.
- `app.cors.allowed-origins` + `app.cookie.secure` from env var, never commit.

## CSRF (come back once cookie use)

`SameSite=Lax` block cross-site POST include cookie = wall. Defense depth: frontend send custom header (`X-Requested-With`), no filter enforces it. Or wire Spring CSRF token later. Supersede issue-009 "CSRF disabled" rule, that hold only for Bearer token.
