# TODO App Project Idea

## Project Overview

The TODO App is a web-based application designed to help users organize their tasks and projects. The app will have the following core features:

- **User Authentication**: Users can sign up, log in, and manage their accounts securely.
- **Project Management**: Users can create, update, and delete projects.
- **Task Management**: Users can add tasks to projects, update their status (e.g., To Do, In Progress, Done), set deadlines, and delete tasks.
- **Dashboard**: Users will have an overview of their tasks and their statuses (e.g., a kanban board or a task summary).
- **Notifications**: Users will receive notifications for tasks nearing deadlines or overdue.
- **Responsive Design**: The app will be fully responsive for both desktop and mobile devices.

---

## Tech Stack

### Frontend

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Ant Design
- **State Management**: Redux
- **Routing**: React Router
- **Other Tools**: Axios for API calls

### Backend

- **Framework**: FastAPI
- **Language**: Python
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Database Migrations**: Alembic
- **Containerization**: Docker for backend services
- **Testing**: Pytest for unit and integration tests
- **Authentication**: JWT (JSON Web Tokens) for secure access

---

## Features and Functional Requirements

### User Authentication

- Users can sign up and log in securely.
- JWT-based authentication for API endpoints.
- Password hashing using industry-standard practices.

### Project Management

- Create, view, update, and delete projects.
- Projects are associated with specific users.

### Task Management

- Add, view, update, and delete tasks for a project.
- Tasks have the following attributes:
  - Title
  - Description
  - Status (To Do, In Progress, Done)
  - Deadline
- Tasks are associated with projects.

### Dashboard

- Overview of all tasks grouped by status or project.
- Kanban-style board or visual summary (e.g., pie charts, progress bars).

### Notifications

- Task reminders for deadlines or overdue tasks.
- Notifications displayed via a bell icon in the header.

---

## Architectural Overview

## Frontend Architecture

The frontend will follow a **feature-based architecture** with **screen-based slicing**. Each feature will have its own folder, and the structure will align with React's component-driven design.

### Folder Structure

```
src/
├── features/
│   ├── auth/          # Feature: Authentication
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── LogoutButton.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── authApi.ts   # API calls for authentication
│   │   ├── models/
│   │   │   └── User.ts      # TypeScript interfaces
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignUpPage.tsx
│   │   └── index.ts         # Barrel export
│   └── dashboard/       # Feature: Dashboard
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── models/
│       ├── pages/
│       └── index.ts
├── shared/             # Shared utilities and components
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Header.tsx
│   ├── hooks/
│   │   └── useFetch.ts
│   ├── utils/
│   │   ├── dateFormatter.ts
│   │   └── validators.ts
│   └── styles/         # Global styles
├── App.tsx             # Main application entry point
└── index.tsx           # React DOM rendering
```

### Key Concepts

- **Feature-Based Slicing**: Each feature (e.g., `auth`, `dashboard`) is self-contained and has its own components, hooks, services, models, and pages.
- **Vertical Slicing by Screens**: Pages are grouped based on screens (e.g., `LoginPage`, `DashboardPage`), promoting modularity.
- **Shared Folder**: Contains reusable components, hooks, utilities, and styles that are used across features.

---

## Backend Architecture

The backend will follow **Clean Architecture** principles with **domain-driven design (DDD)** concepts. The project will be divided into four layers: **Domain**, **Application**, **Infrastructure**, and **Presentation**.

### Layered Architecture

1. **Domain Layer**:

   - Contains the core business logic and entities that are independent of frameworks or external systems.
   - Defines interfaces for repositories, services, and other abstractions.

2. **Application Layer**:

   - Orchestrates use cases and application logic.
   - Implements services that interact with the domain layer and external systems.
   - Contains DTOs and mappers for input/output data.

3. **Infrastructure Layer**:

   - Manages data access, external APIs, and other framework-dependent operations.
   - Contains repository implementations, database migrations, and configuration files.

4. **Presentation Layer**:
   - Exposes the API to the outside world via FastAPI endpoints.
   - Handles HTTP requests, middleware, and error handling.

### Folder Structure

```
src/
├── domain/            # Core business logic
│   ├── entities/
│   │   ├── Project.py
│   │   ├── Task.py
│   │   └── User.py
│   ├── interfaces/
│   │   ├── project_repository.py
│   │   ├── task_repository.py
│   │   └── user_repository.py
│   └── services/
│       ├── project_service.py
│       └── task_service.py
├── application/       # Application logic
│   ├── use_cases/
│   │   ├── create_project.py
│   │   ├── list_projects.py
│   │   └── update_task_status.py
│   ├── dto/           # Data Transfer Objects
│   │   ├── project_dto.py
│   │   └── task_dto.py
│   ├── mappers/
│   │   ├── project_mapper.py
│   │   └── task_mapper.py
│   └── services/
│       └── notification_service.py
├── infrastructure/    # Framework-dependent code
│   ├── database/
│   │   ├── migrations/
│   │   ├── models/    # ORM models (SQLAlchemy)
│   │   │   ├── project_model.py
│   │   │   ├── task_model.py
│   │   │   └── user_model.py
│   │   └── repository/
│   │       ├── project_repository_impl.py
│   │       ├── task_repository_impl.py
│   │       └── user_repository_impl.py
│   ├── config.py      # Configuration settings
│   └── docker/        # Docker-related files
│       ├── Dockerfile
│       └── docker-compose.yml
├── presentation/      # API layer
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── project_routes.py
│   │   └── task_routes.py
│   ├── middlewares/
│   │   └── auth_middleware.py
│   ├── exceptions.py
│   └── main.py        # FastAPI entry point
└── tests/             # Unit and integration tests
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── presentation/
```

### Key Concepts

- **Clean Architecture**: Separates concerns into distinct layers to ensure scalability, maintainability, and testability.
- **Dependency Inversion Principle**: Higher-level layers (e.g., `Application`) depend on abstractions defined in the `Domain` layer.
- **Feature-Based Slicing**: Each feature (e.g., `project`, `task`, `user`) is implemented across all layers.

---

## Development Tools

### CI/CD

- GitHub Actions for automated testing and deployment.
- Docker Compose for local development and testing.

### Version Control

- Git for source control.
- GitHub for repository hosting and collaboration.

### Documentation

- **API Documentation**: Auto-generated using FastAPI’s interactive Swagger UI.
- **Project Documentation**: README files and additional guides for developers.

---

## Database Schema

### Tables

1. **Users**

   - `id`: Primary key
   - `username`: Unique
   - `email`: Unique
   - `password`: Hashed
   - `created_at`: Timestamp

2. **Projects**

   - `id`: Primary key
   - `name`: Project name
   - `description`: Optional
   - `user_id`: Foreign key (linked to Users)
   - `created_at`: Timestamp

3. **Tasks**
   - `id`: Primary key
   - `title`: Task title
   - `description`: Optional
   - `status`: Enum (To Do, In Progress, Done)
   - `deadline`: Datetime
   - `project_id`: Foreign key (linked to Projects)
   - `created_at`: Timestamp

---

## Development Milestones

### Phase 1: Initial Setup

- Set up the development environment (Docker, Vite, FastAPI, PostgreSQL).
- Create the database schema with Alembic migrations.
- Set up the FastAPI project structure.

### Phase 2: Authentication

- Implement user authentication (sign-up, login, JWT-based access).
- Create the frontend login and registration pages.

### Phase 3: Projects and Tasks

- Implement CRUD operations for projects and tasks on the backend.
- Create frontend pages for managing projects and tasks.

### Phase 4: Dashboard and Notifications

- Implement the dashboard to display task summaries.
- Add notifications for task deadlines and overdue tasks.

### Phase 5: Testing

- Write unit tests for backend APIs (pytest).
- Write integration tests for frontend components.

### Phase 6: Deployment

- Set up CI/CD pipelines using GitHub Actions.
- Deploy the application using Docker on a cloud platform (e.g., AWS, Heroku).

---

## Design Considerations

- Focus on modular and reusable code adhering to SOLID principles.
- Ensure scalability for future features like collaborative projects.
- Optimize for performance and responsiveness.

---

## Future Enhancements

- Add a collaboration feature for multiple users to work on the same project.
- Enable task dependencies (e.g., Task B cannot start until Task A is completed).
- Implement a calendar view for tasks and deadlines.
- Add integration with third-party tools (e.g., Google Calendar).
