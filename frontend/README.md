# Campus Event Management Frontend

React and Vite frontend for the campus event management site.

## Run

```
npm install
npm run dev
```

Serves at http://localhost:5173.

## Scripts

- `npm run dev` start the dev server
- `npm run build` production build into `dist/`
- `npm run preview` preview the build
- `npm run lint` run ESLint
- `npm test` run the unit tests (`node --test`)

## Routes

- `/` home page
- `/events` all events, optional `?category=`
- `/event?id=1` standalone event details and student registration
- `/login` login
- `/signup` sign up
- `/dashboard` protected admin dashboard
- `/dashboard/events/new`, `/dashboard/events/:eventId/edit` admin event editor
- `/my-events` protected student registrations page
- `/profile` protected profile: name, email and role
- `/admin` legacy admin dashboard route, admins only

## Data and auth

Everything goes through `src/api/` (`client.js` plus one module per resource).
Calls are relative `/api` only: Vite proxies it in dev, nginx proxies it in
Docker, so no `VITE_API_URL` is needed. The JWT lives in the `HttpOnly`
`jwt_token` cookie, which the browser attaches automatically; the frontend never
sees a token and sends `credentials: 'include'` on every call.

The session is restored on boot from `GET /api/auth/me`. A `401` from any other
call means the cookie expired mid-session: the client clears the user and
redirects to `/login`.

The credentials below are development seeds, not production credentials:

- Student: `sidra.butt@gmail.com` / `Demo@12345`
- Admin: `ayesha.khan.admin@gmail.com` / `Demo@12345`
