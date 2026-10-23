# Setup & Installation Guide

## Frontend Setup

```shell
cd frontend
npm install
npm start
```

The app runs on `http://localhost:3000`

## Backend Setup

### 1. Navigate to Backend

If not cloned yet, clone first (see [README](../README.md) Installation), then:

```shell
cd backend
```

Java 21 and the Maven wrapper (`./mvnw`) are all you need.

### 2. Configure Database

The backend talks to MySQL. Create the database and the application user once,
as an admin:

```sql
CREATE DATABASE campus_events;
CREATE USER 'campus'@'localhost' IDENTIFIED BY 'campus123';
GRANT ALL PRIVILEGES ON campus_events.* TO 'campus'@'localhost';
```

Load the schema and the demo data (both live in `backend/database/`):

```shell
mysql -u campus -p campus_events < backend/database/schema.sql
mysql -u campus -p campus_events < backend/database/seed.sql
```

`seed.sql` loads 100 users, 555 events and 1000 registrations, and is
re-runnable (it clears the three tables first). `schema.sql` is not: it uses
`CREATE TABLE IF NOT EXISTS`, so after a schema change drop the database and
reload both files.

The connection defaults live in `src/main/resources/application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/campus_events
spring.datasource.username=campus
spring.datasource.password=campus123
spring.jpa.hibernate.ddl-auto=none
```

`APP_DB_URL`, `APP_DB_USER`, `APP_DB_PASSWORD` and `APP_DB_DIALECT` override
them. `ddl-auto=none` is deliberate: `schema.sql` owns the schema, Hibernate
never runs DDL.

### 3. Build and Run

```
./mvnw clean install
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### 4. Demo Accounts

Every seeded account uses the password `Demo@12345` (stated in `seed.sql`):

| Role | Email |
|---|---|
| Admin | `ayesha.khan.admin@gmail.com` |
| Admin | `hamza.malik.admin@outlook.com` |
| Student | `sidra.butt@gmail.com` |

Public signup always creates a `STUDENT`; admin accounts come from the seed.

## Frontend to Backend Connection

Update API calls in React components to point to backend:

```javascript
const response = await fetch("http://localhost:8080/api/events");
const data = await response.json();
```

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
- Frontend: `PORT=3001 npm start`

**CORS Issues:**

CORS (Cross-Origin Resource Sharing) issues may arise when the frontend and backend are on different ports. To resolve:

- Add CORS configuration in Spring Boot controller or use `@CrossOrigin`

**Build Errors:**

- Run `mvn clean` before rebuilding
- Check Java version compatibility
