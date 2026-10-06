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
# to be added further
```

### 2. Configure Database

Create MySQL database:

```
CREATE DATABASE campus_events;
```

Update `src/main/resources/application.properties`:

```
spring.datasource.url=jdbc:mysql://localhost:3306/campus_events
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 3. Build and Run

```
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

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

**Port Already in Use:**

- Backend: Change port in `application.properties` with `server.port=8081`
- Frontend: `PORT=3001 npm start`

**CORS Issues:**

CORS (Cross-Origin Resource Sharing) issues may arise when the frontend and backend are on different ports. To resolve:

- Add CORS configuration in Spring Boot controller or use `@CrossOrigin`

**Build Errors:**

- Run `mvn clean` before rebuilding
- Check Java version compatibility
