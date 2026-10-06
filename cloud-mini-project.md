# **MINI PROJECT** 

## **Full-Stack Web Application with Git & GitHub Collaboration** 

**Project Title** 

**Campus Event Management System** 

**Team Size** 

#### **5 Students** 

- **1 Student – Team Lead** 

- **4 Students – Team Members** 

### **Project Objective** 

The purpose of this mini project is to develop a complete **Full-Stack Web Application** consisting of: 

- Front End 

- Back End 

- Database 

- REST APIs 

- Git & GitHub collaboration 

- Branching 

- Pull Requests 

- Code Review 

- Issue Tracking 

- Integration and Deployment 

Every student must contribute to the same GitHub repository. Students must demonstrate that they can work as a software development team rather than developing the complete project individually. 

# **1. Project Scenario** 

The university wants a web application where students can view and register for university events such as: 

- Seminars 

- Workshops 

- Sports Events 

- Competitions 

- Conferences 

- Student Societies Activities 

The system will allow an administrator or authorized user to create events, while students can view available events and register for them. 

# **2. Suggested Technology Stack** 

### **Front End** 

Students may use: 

- HTML5 

- CSS3 

- JavaScript 

#### **OR** 

- React.js 

### **Back End** 

Use one of the following: 

- Node.js + Express.js 

- Python + Flask 

- Python + Django 

### **Database** 

Use: 

- SQLite 

- MySQL 

- PostgreSQL 

- MongoDB 

### **Version Control** 

- Git 

- GitHub 

### **Deployment** 

Students may deploy the application using any suitable platform, such as: 

- GitHub Pages for static front end 

- Render 

- Railway 

- Vercel 

- Netlify 

- Another instructor-approved platform 

# **3. Team Structure** 

## **Student 1 – Team Lead / Project Manager** 

The Team Lead is responsible for managing the complete GitHub project. 

### **Responsibilities** 

1. Create the GitHub repository. 

2. Add the other four students as collaborators. 

3. Create the project `README.md` . 

4. Create GitHub Issues for project tasks. 

5. Create GitHub labels such as: 

   - Frontend 

   - Backend 

   - Database 

   - Bug 

   - Documentation 

   - Testing 

6. Create the project development branches. 

7. Assign tasks to team members. 

8. Monitor progress. 

9. Review Pull Requests. 

10. Merge approved Pull Requests. 

11. Resolve merge conflicts when required. 

12. Integrate Front End and Back End. 

13. Ensure the final application works correctly. 

14. Coordinate deployment. 

15. Give the final project demonstration. 

### **Team Lead Branch** 

```
main
```

The `main` branch must always contain the stable version of the project. 

# **4. Student 2 – Front-End Developer 1** 

### **Responsibilities** 

Develop the main user interface. 

### **Tasks** 

Create: 

- Home Page 

- Navigation Bar 

- Event Listing Page 

- Event Cards 

- Footer 

- Responsive Layout 

- CSS Styling 

### **Suggested Branch** 

```
feature/frontend-ui
```

### **Required Contribution** 

At least: 

- 4 meaningful commits 

- 1 Pull Request 

- 1 Issue completed 

# **5. Student 3 – Front-End Developer 2** 

### **Responsibilities** 

Develop the interactive front-end functionality. 

### **Tasks** 

Create: 

- Event Details Page 

- Student Registration Form 

- Login Page 

- Dashboard 

- Form Validation 

- Search Events 

- Filter Events 

The student will also integrate the Front End with the Back-End APIs. 

### **Suggested Branch** 

```
feature/frontend-functionality
```

### **Required Contribution** 

At least: 

- 4 meaningful commits 

- 1 Pull Request 

- 1 Issue completed 

# **6. Student 4 – Back-End Developer 1** 

### **Responsibilities** 

Develop the server and REST APIs. 

### **Tasks** 

Create APIs for: 

### **Events** 

```
GET    /api/events
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

### **Student Registration** 

```
POST /api/register
GET  /api/registrations
```

### **Authentication** 

Implement basic: 

```
POST /api/login
POST /api/signup
```

### **Suggested Branch** 

```
feature/backend-api
```

# **7. Student 5 – Back-End Developer 2 / Database & Testing** 

### **Responsibilities** 

Manage the database and testing. 

### **Database Tables** 

Create suitable tables such as: 

### **Users** 

```
id
name
email
password
role
```

### **Events** 

```
id
title
description
date
time
location
category
capacity
```

### **Registrations** 

```
id
user_id
event_id
registration_date
```

### **Additional Responsibilities** 

- Database connection 

- CRUD operations 

- API testing 

- Error handling 

- Validation 

- Bug fixing 

- Testing with Postman 

- Documentation 

### **Suggested Branch** 

```
feature/database-testing
```

# **8. GitHub Repository Structure** 

The final repository should have a structure similar to: 

```
campus-event-management/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── README.md
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── database/
│   └── README.md
│
├── screenshots/
│
├── documentation/
│
├── README.md
├── .gitignore
└── LICENSE
```

# **9. GitHub Collaboration Rules** 

All students must follow the GitHub workflow. 

## **Step 1 – Team Lead Creates Repository** 

Example: 

```
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin <github-repository-url>
git push -u origin main
```

Then the Team Lead adds the other four students as collaborators. 

# **10. Clone the Repository** 

Every team member must clone the same repository. 

```
git clone <github-repository-url>
cd campus-event-management
```

# **11. Create Your Own Branch** 

Students must **not directly develop on** **`main`** . 

Example: 

`git checkout -b feature/frontend-ui` or `git checkout -b feature/backend-api` or 

```
git checkout -b feature/database-testing
```

# **12. Development Process** 

Every student follows: 

```
Pull Latest Code
       ↓
Create / Switch to Branch
       ↓
Complete Assigned Task
       ↓
Test Code
       ↓
git add
       ↓
git commit
       ↓
git push
       ↓
Create Pull Request
       ↓
Team Lead Reviews
       ↓
Changes Requested / Approved
       ↓
Merge into main
```

# **13. Commit Rules** 

Students must make meaningful commits. 

### **Good Commit Examples** 

```
git commit -m "Create responsive event listing page"
git commit -m "Add event registration API"
git commit -m "Create users and events database tables"
git commit -m "Add login form validation"
```

### **Bad Commit Examples** 

```
git commit -m "update"
git commit -m "changes"
git commit -m "final"
```

Each commit should clearly explain what was changed. 

# **14. Pull Request Requirement** 

After completing a task: 

```
git push origin feature/frontend-ui
```

The student must create a **Pull Request** from: 

```
feature/frontend-ui
```

```
        ↓
      main
```

The Pull Request should contain: 

- What was implemented 

- Files changed 

- Testing performed 

- Screenshots where appropriate 

The Team Lead reviews the Pull Request before merging. 

# **15. Code Review** 

The Team Lead must review every Pull Request. 

The Team Lead should check: 

- Code quality 

- Correct functionality 

- Naming conventions 

- Errors 

- Security issues 

- UI design 

- API functionality 

- Database integration 

The Team Lead can: 

```
Approve
```

or 

```
Request Changes
```

A student must fix requested changes before the Pull Request is merged. 

# **16. GitHub Issues** 

The Team Lead must create GitHub Issues before development. 

Example Issues: 

### **Issue #1** 

Create Home Page 

Assigned to: 

```
Frontend Developer 1
```

### **Issue #2** 

Create Event Registration Form 

Assigned to: 

```
Frontend Developer 2
```

### **Issue #3** 

Develop Event REST API 

Assigned to: 

```
Backend Developer 1
```

### **Issue #4** 

Create Database Assigned to: `Backend Developer 2` 

### **Issue #5** 

Integrate Front End and Back End 

Assigned to: `Team Lead` 

# **17. Minimum Functional Requirements** 

The completed application must provide the following functionality: 

## **Home Page** 

Display: 

- University name 

- Navigation menu 

- Featured events 

- Login/Register buttons 

## **Event Page** 

Display: 

- Event title 

- Description 

- Date 

- Time 

- Location 

- Category 

- Available seats 

## **Search** 

Student should be able to search for events. 

Example: 

```
Search: AI Workshop
```

## **Filtering** 

Student should be able to filter events by category. 

Example: 

```
Seminar
Workshop
Sports
Competition
```

## **Registration** 

A student can register for an event. 

## **Login** 

Users should be able to log in. 

## **Admin/Event Management** 

An authorized user should be able to: 

```
Create Event
Update Event
Delete Event
View Events
```

## **Database** 

Data must be stored in a real database rather than only hard-coded in the Front End. 

# **18. API Integration** 

The Front End must communicate with the Back End. 

Example: 

```
fetch("http://localhost:5000/api/events")
```

The application should retrieve event information from the API instead of hard-coding all events into HTML/React. 

# **19. Testing Requirements** 

Students must test: 

### **Front End** 

- Buttons 

- Forms 

- Navigation 

- Search 

- Filters 

- Responsive design 

### **Back End** 

Test APIs using: 

#### **Postman** 

Test: 

```
GET
POST
PUT
DELETE
```

### **Database** 

Verify: 

- Insert 

- Select 

- Update 

- Delete 

operations. 

# **20. Final GitHub Requirements** 

The final repository must contain: 

- ✓ `Source Code` 

- ✓ `Front End` 

- ✓ `Back End` 

- ✓ `Database` 

- ✓ `README.md` 

- ✓ `.gitignore` 

- ✓ `GitHub Issues` 

- ✓ `Multiple Branches` 

- ✓ `Pull Requests` 

- ✓ `Code Reviews` 

- ✓ `Meaningful Commits` 

- ✓ `Screenshots` 

- ✓ `API Documentation` 

- ✓ `Installation Instructions` 

# **21. README.md Requirements** 

The Team Lead must create a professional README containing: 

## **Project Title** 

Campus Event Management System 

## **Team Members** 

```
Student 1 – Team Lead
Student 2 – Frontend Developer
Student 3 – Frontend Developer
Student 4 – Backend Developer
Student 5 – Database/Testing Developer
```

## **Project Description** 

Explain the purpose of the project. 

## **Technologies** 

Example: 

```
HTML
CSS
JavaScript / React
Node.js
Express.js
SQLite
Git
GitHub
Postman
```

## **Installation** 

Explain how another developer can run the project. 

Example: 

```
git clone <repository-url>
cd campus-event-management
```

Then provide Front End and Back End commands. 

# **22. Final Demonstration** 

Each student must participate in the final presentation. 

### **Team Lead** 

Explain: 

- Project architecture 

- GitHub repository 

- Branch strategy 

- Pull Requests 

- Team coordination 

### **Front-End Student 1** 

Demonstrate: 

- UI 

- Navigation 

- Event listing 

### **Front-End Student 2** 

Demonstrate: 

- Forms 

- Search 

- Event registration 

- API integration 

### **Back-End Student 1** 

Demonstrate: 

- Server 

- REST APIs 

- API testing 

### **Back-End Student 2** 

Demonstrate: 

- Database 

- Testing 

- Error handling 

# **23. Git Commands Students Must Demonstrate** 

Every student should know and demonstrate: 

```
git clone
git status
git add
git commit
git push
git pull
git branch
git checkout
git switch
git merge
git log
git remote
```

The Team Lead should additionally demonstrate: 

```
git fetch
git pull
git merge
git branch -d
```

Students should also demonstrate how GitHub is used for: 

```
Issues
Branches
Pull Requests
Code Review
Merge
Repository Management
```

# **24. Optional Advanced Requirements** 

For extra marks, students may implement: 

```
JWT Authentication
Role-Based Access
```

```
Admin Dashboard
Docker
GitHub Actions
Automated Testing
CI/CD
Cloud Deployment
API Documentation
```

A GitHub Actions workflow can automatically run whenever code is pushed. 

# **25. Suggested Project Timeline** 

### **Day 1** 

Project planning and GitHub repository setup 

### **Day 2–3** 

Front-End development 

### **Day 3–4** 

Back-End and database development 

### **Day 5** 

API integration 

### **Day 6** 

Testing and bug fixing 

### **Day 7** 

Final Pull Requests, merge, documentation and presentation 

# **26. Assessment / Marks** 

|**Component**|**Marks**|
|---|---|
|Git & GitHub Collaboration|15|
|Front End|20|
|Back End|20|
|Database|10|
|API Integration|10|



|**Component**|**Marks**|
|---|---|
|Testing|5|
|Documentation|5|
|Final Presentation|10|
|Individual Contribution|5|
|**Total**|**100**|



# **27. Important Rule** 

#### **No student is allowed to complete the complete project alone.** 

The instructor will evaluate individual contribution using: 

- GitHub commits 

- Branches 

- Issues 

- Pull Requests 

- Code reviews 

- Individual task completion 

A student who has very few or no meaningful GitHub contributions may receive reduced individual marks even if the final project works. 

# **Final Deliverable** 

At the end of the project, the team must submit: 

### **1. GitHub Repository** 

Complete source code. 

### **2. Working Application** 

Front End + Back End + Database. 

### **3. Project Documentation** 

Architecture, installation, API and database documentation. 

### **4. Presentation** 

- 5–10 minutes per team. 

### **5. GitHub Evidence** 

The instructor should be able to verify each student's: 

```
Commits
Issues
Branches
Pull Requests
Code Reviews
Contributions
```

## **Final Goal** 

The project should demonstrate that **five students can work together like a real software development team using GitHub** , while producing a complete **Front-End + Back-End + Database web application** . 

