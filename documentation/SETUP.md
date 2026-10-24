# Setup & Installation Guide

## Frontend Setup

```shell
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`

## Backend Setup

### 1. Navigate to Backend

If not cloned yet, clone first (see [README](../README.md) Installation), then:

```shell
cd backend
```

Java 21 and the Maven wrapper (`./mvnw`) are all you need.

### 2. Configure Database

The backend needs a working MySQL server.

Easiest method: run this from the
`backend` directory:

```shell
sudo mysql -e "CREATE DATABASE IF NOT EXISTS campus_events; CREATE USER IF NOT EXISTS 'campus'@'localhost' IDENTIFIED BY 'campus123'; ALTER USER 'campus'@'localhost' IDENTIFIED BY 'campus123'; GRANT ALL PRIVILEGES ON campus_events.* TO 'campus'@'localhost'; FLUSH PRIVILEGES;"
```

This creates the database and local `campus` user automatically. No interactive MySQL shell needed.

If you prefer the interactive MySQL shell, run:

```shell
sudo mysql
```

Then paste this SQL and type `exit`:

```sql
CREATE DATABASE IF NOT EXISTS campus_events;
CREATE USER IF NOT EXISTS 'campus'@'localhost' IDENTIFIED BY 'campus123';
ALTER USER 'campus'@'localhost' IDENTIFIED BY 'campus123';
GRANT ALL PRIVILEGES ON campus_events.* TO 'campus'@'localhost';
FLUSH PRIVILEGES;
```

Now load the schema. This creates the tables. Run this command from the `backend` directory:

```shell
mysql -u campus -p campus_events < database/schema.sql
```

Enter `campus123` when MySQL asks for the password.

Load the demo data next:

```shell
mysql -u campus -p campus_events < database/seed.sql
```

- `schema.sql` creates the tables.
- `seed.sql` loads 100 users, 555 events and 1000 registrations. The seed is re-runnable because it clears the three tables first.

The schema is not re-runnable after structural changes; drop the database and reload both files when needed.

The (backend) connection defaults live in `src/main/resources/application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/campus_events
spring.datasource.username=campus
spring.datasource.password=campus123
spring.jpa.hibernate.ddl-auto=none
```

`APP_DB_URL`, `APP_DB_USER`, `APP_DB_PASSWORD` and `APP_DB_DIALECT` override them.

> [!note]
> `ddl-auto=none` is deliberate: `schema.sql` owns the schema, Hibernate never runs DDL.

### 3. Build and Run Backend

Keep the terminal in the `backend` directory:

```
./mvnw clean install
./mvnw spring-boot:run
```

Spring Boot reads the database URL, username and password from `src/main/resources/application.properties`, then connects to the database created above. Backend runs on `http://localhost:8080`.

### MySQL Shell Quick Reference

Open the application database directly:

```shell
mysql -u campus -p campus_events
```

Useful commands:

```sql
SHOW TABLES;
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM registrations;
exit
```

### Manage Database with a GUI

MySQL Workbench and DBeaver can manage the same database without using the
shell. Create a connection with these values:

| Setting  | Value           |
| -------- | --------------- |
| Host     | `localhost`     |
| Port     | `3306`          |
| User     | `campus`        |
| Password | `campus123`     |
| Database | `campus_events` |

Open a SQL editor in the GUI. Run `database/schema.sql` first, then `database/seed.sql`. Refresh the `campus_events` connection to browse tables and rows.

### 4. Demo Accounts

Every seeded account uses the password `Demo@12345` (stated in `seed.sql`):

| Role    | Email                           |
| ------- | ------------------------------- |
| Admin   | `ayesha.khan.admin@gmail.com`   |
| Admin   | `hamza.malik.admin@outlook.com` |
| Student | `sidra.butt@gmail.com`          |

Public signup always creates a `STUDENT`; admin accounts come from the seed.

## Frontend to Backend Connection

Run both at once (frontend uses Vite proxy so no `fetch` base URL is needed):

```shell
# terminal 1
cd backend && ./mvnw spring-boot:run

# terminal 2
cd frontend && npm install && npm run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:8080` (`vite.config.js`), so React calls relative URLs:

```javascript
const response = await fetch("/api/events", { credentials: "include" });
const data = await response.json(); // returns PageResponse envelope {content,page,size,totalElements,totalPages,first,last}
```

Cookie auth (`jwt_token`, `HttpOnly`) requires `CorsConfig.setAllowCredentials(true)` (done) and `credentials: "include"` (or same-origin proxy — no CORS). The backend `GET /api/events` also accepts `?createdBy=<id>` (admin scope) and paginates at `?page=0&size=20` (max 100).

## Git Workflow

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the full workflow (issue → branch → PR → review → merge).

## Deployment (Render)

1. Push code to GitHub
2. Connect Render to GitHub repo
3. Deploy frontend to Vercel/Netlify
4. Deploy backend to Render
5. Update API URLs in frontend for production

## Troubleshooting

**MySQL Connection Error:**

- Ensure MySQL server is running
- Check database credentials in `application.properties`
- Verify database exists
- Verify the schema and seed are loaded: `mysql -u campus -p campus_events < backend/database/schema.sql`

**Startup fails with "Unable to determine Dialect":**

- Hibernate's dialect detection reads MySQL 8 metadata that the server may not expose, so the dialect is pinned to `MySQLDialect` in `application.properties`. Set `APP_DB_DIALECT` to another dialect when the server identifies itself differently.

**Port Already in Use:**

- Backend: Change port in `application.properties` with `server.port=8081`
- Frontend: `npm run dev -- --port 3001`

**CORS Issues:**

CORS is already configured for the local frontend at `http://localhost:5173` in `CorsConfig.java`. If the frontend uses another port, update the allowed origin there.

**Build Errors:**

- Run `mvn clean` before rebuilding
- Check Java version compatibility
