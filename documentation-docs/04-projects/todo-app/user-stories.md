# User Stories for TODO App

## User Authentication

### Title: User Login

**Description:** Allow users to log in using their credentials to access their projects and tasks.  
**Acceptance Criteria:**

- User can log in with email and password.
- User sees an error message for invalid credentials.
- Successful login redirects to the dashboard.  
  **Assigned To:** Backend Developer

### Title: User Sign-Up

**Description:** Enable users to create an account with an email and password.  
**Acceptance Criteria:**

- User can register with a unique email and secure password.
- Password must meet security requirements.
- Successful registration redirects to the login page.  
  **Assigned To:** Backend Developer

### Title: User Logout

**Description:** Allow users to securely log out of the application.  
**Acceptance Criteria:**

- Clicking "Logout" ends the session.
- User is redirected to the login page.  
  **Assigned To:** Frontend Developer

---

## Project Management

### Title: Create Project

**Description:** Allow users to create a new project to group their tasks.  
**Acceptance Criteria:**

- User can input a project name and optional description.
- Project is saved to the database.
- Newly created project appears in the project list.  
  **Assigned To:** Backend Developer

### Title: View Projects

**Description:** Display a list of all projects created by the user.  
**Acceptance Criteria:**

- User sees a scrollable list of all their projects.
- Each project card includes the project name and description.  
  **Assigned To:** Frontend Developer

### Title: Edit/Delete Project

**Description:** Allow users to update or delete an existing project.  
**Acceptance Criteria:**

- User can edit a project name or description.
- User can delete a project, and all associated tasks are removed.  
  **Assigned To:** Backend Developer

---

## Task Management

### Title: Add Task to Project

**Description:** Allow users to add tasks to a specific project.  
**Acceptance Criteria:**

- User can input a task name, description, status, and deadline.
- Task is associated with the selected project.
- Task appears in the project’s task list after creation.  
  **Assigned To:** Backend Developer

### Title: Update Task Status

**Description:** Allow users to update the status of a task.  
**Acceptance Criteria:**

- User can change task status to “To Do,” “In Progress,” or “Done.”
- Task status updates are saved to the database.  
  **Assigned To:** Backend Developer

### Title: View Tasks by Project

**Description:** Display all tasks associated with a specific project.  
**Acceptance Criteria:**

- Tasks are grouped by status (e.g., To Do, In Progress, Done).
- User can filter tasks by status or deadline.  
  **Assigned To:** Frontend Developer

---

## Dashboard

### Title: Dashboard Summary

**Description:** Provide a dashboard that summarizes all tasks and their statuses.  
**Acceptance Criteria:**

- User sees a breakdown of tasks by status (e.g., pie chart, kanban board).
- Overdue tasks are highlighted.
- User can navigate to projects or tasks from the dashboard.  
  **Assigned To:** Frontend Developer

---

## Notifications

### Title: Task Notifications

**Description:** Notify users about tasks nearing deadlines or overdue.  
**Acceptance Criteria:**

- User sees a bell icon with a count of unread notifications.
- Clicking the bell shows a dropdown of task notifications.
- Notifications include task name, deadline, and project name.  
  **Assigned To:** Backend Developer

---

## Figma Prototyping

### Title: Create Figma Wireframes

**Description:** Design wireframes for all major pages, including Login, Dashboard, Projects, and Tasks.  
**Acceptance Criteria:**

- Wireframes include basic layout and navigation flow.
- Stakeholders can review and provide feedback on wireframe designs.
- Finalized wireframes are stored in a shared Figma file.  
  **Assigned To:** UX/UI Designer

### Title: High-Fidelity Mockups

**Description:** Develop high-fidelity mockups based on the wireframes to include color schemes, typography, and branding.  
**Acceptance Criteria:**

- Mockups accurately reflect the final application design.
- Mockups include responsiveness for desktop, tablet, and mobile.  
  **Assigned To:** UX/UI Designer

---

## Database Design

### Title: Define Database Schema

**Description:** Design the database schema to support users, projects, and tasks.  
**Acceptance Criteria:**

- Schema includes tables for `users`, `projects`, and `tasks`.
- Foreign key relationships are defined (e.g., tasks linked to projects, projects linked to users).
- Schema supports scalability (e.g., indexes for faster querying).  
  **Assigned To:** Database Developer

### Title: Create ERD for Database

**Description:** Create an Entity-Relationship Diagram (ERD) to visualize the database structure.  
**Acceptance Criteria:**

- ERD includes relationships, data types, and constraints for all entities.
- ERD is shared and reviewed by the development team.  
  **Assigned To:** Database Developer

---

## Documentation

### Title: Write API Documentation

**Description:** Document all API endpoints, including their purpose, request parameters, and responses.  
**Acceptance Criteria:**

- Documentation includes examples for each endpoint.
- Documentation is updated as endpoints are modified or added.
- Documentation is available in a centralized location (e.g., Swagger or Postman).  
  **Assigned To:** Backend Developer

### Title: Create README

**Description:** Write a README file to explain the purpose, setup, and usage of the application.  
**Acceptance Criteria:**

- README includes sections for installation, usage, and contribution guidelines.
- README includes screenshots of the application (if available).  
  **Assigned To:** Backend Developer

### Title: Write Developer Onboarding Guide

**Description:** Create documentation to help new developers understand the project structure and how to contribute.  
**Acceptance Criteria:**

- Guide includes instructions for setting up the development environment.
- Explains the folder structure and coding conventions.  
  **Assigned To:** Backend Developer
