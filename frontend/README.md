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
- `/event?id=1` standalone event details and demo registration
- `/login` login, optional `?role=admin`
- `/signup` sign up
- `/dashboard` protected admin dashboard
- `/my-events` protected student registrations page
- `/profile` protected role-aware demo profile
- `/admin` legacy admin dashboard route, admins only

## Data and auth

Events and registrations pass through `src/assets/data.js`, which currently uses
demo data and `localStorage` so it can be replaced by API calls later. Login and
sign up are also demo-only and stored in `localStorage`.

The credentials below are development seeds, not production credentials. They
must move to server-side authentication with hashed passwords before deployment:

- Student: `student@campus.com` / `student123`
- Admin: `admin@campus.com` / `admin123`
