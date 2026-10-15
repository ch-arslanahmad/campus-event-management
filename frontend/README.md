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

## Routes

- `/` home page
- `/events` all events, optional `?category=`
- `/login` login, optional `?role=admin`
- `/signup` sign up
- `/admin` admin dashboard, admins only

## Data and auth

Events are sample data in `src/assets/eventsData.js`. Login and sign up are
demo only, stored in `localStorage`, and get replaced by the real API.
Demo admin: `admin@campus.com` / `admin123`.
