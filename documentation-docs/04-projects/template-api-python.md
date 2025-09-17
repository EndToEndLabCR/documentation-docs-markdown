# Template API Python

This file documents the Python API template project structure and best practices.

## Project Overview

The Template API Python is a FastAPI-based starter template designed to accelerate the development of modern Python APIs. It includes best practices, common patterns, and essential configurations.

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with OAuth2
- **Documentation**: Automatic OpenAPI/Swagger
- **Testing**: pytest with test coverage
- **Containerization**: Docker with multi-stage builds

## Project Structure

```
template-api-python/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   └── dependencies.py
│   │   └── routes.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   ├── models/
│   │   ├── user.py
│   │   └── base.py
│   ├── schemas/
│   │   ├── user.py
│   │   └── token.py
│   ├── services/
│   │   └── user_service.py
│   └── main.py
├── tests/
│   ├── api/
│   ├── services/
│   └── conftest.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Key Features

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control
- Password hashing with bcrypt
- OAuth2 with scopes

### Database Integration
- SQLAlchemy ORM with Alembic migrations
- Repository pattern implementation
- Connection pooling
- Database health checks

### API Documentation
- Automatic OpenAPI schema generation
- Interactive Swagger UI
- ReDoc documentation
- API versioning support

### Development Tools
- Hot reload for development
- Pre-commit hooks
- Code formatting with Black
- Linting with flake8
- Type checking with mypy

## Getting Started

### Prerequisites
- Python 3.9+
- PostgreSQL
- Docker (optional)

### Installation
```bash
# Clone the template
git clone https://github.com/EndToEndLabCR/template-api-python
cd template-api-python

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload
```

### Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up --build

# API will be available at http://localhost:8000
# Documentation at http://localhost:8000/docs
```

## Usage Examples

### Creating a User
```python
from app.schemas.user import UserCreate
from app.services.user_service import UserService

user_data = UserCreate(
    email="user@example.com",
    password="securepassword",
    full_name="John Doe"
)

user = await UserService.create_user(user_data)
```

### API Endpoints
```bash
# Health check
GET /health

# Authentication
POST /auth/login
POST /auth/register
POST /auth/refresh

# Users
GET /api/v1/users/
GET /api/v1/users/{user_id}
PUT /api/v1/users/{user_id}
DELETE /api/v1/users/{user_id}
```

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/api/test_users.py
```

## Deployment

### Environment Configuration
- Development: `.env.dev`
- Staging: `.env.staging`
- Production: `.env.prod`

### CI/CD Pipeline
- GitHub Actions for automated testing
- Docker image building and pushing
- Automated deployment to staging/production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Best Practices Implemented

- Clean architecture principles
- Dependency injection
- Error handling and logging
- API rate limiting
- Request validation
- Response serialization
- Database connection management
- Security headers and CORS
- Health checks and monitoring