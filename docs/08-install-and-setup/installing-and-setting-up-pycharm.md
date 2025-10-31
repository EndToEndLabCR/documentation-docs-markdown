# Installing and Setting Up PyCharm

This file provides comprehensive instructions for installing and configuring PyCharm for Python development.

## Installation

### System Requirements

- **RAM**: 8 GB minimum, 16 GB recommended for large projects
- **CPU**: Multi-core processor
- **Disk Space**: 3.5 GB for IDE, additional for projects and environments
- **Python**: Python 3.6+ (PyCharm can install Python if needed)

### Installation Methods

#### JetBrains Toolbox (Recommended)

```bash
# Download from: https://www.jetbrains.com/toolbox-app/
# Benefits:
# - Easy version management
# - Automatic updates
# - License management
# - Multiple IDE versions
```

#### Package Managers

```bash
# macOS via Homebrew
brew install --cask pycharm-ce          # Community Edition
brew install --cask pycharm             # Professional Edition

# Windows via Chocolatey
choco install pycharm-community         # Community Edition
choco install pycharm                   # Professional Edition

# Linux via Snap
sudo snap install pycharm-community --classic
sudo snap install pycharm-professional --classic

# Ubuntu/Debian via APT
sudo snap install pycharm-community --classic
```

## Initial Configuration

### First Launch Setup

1. **Import Settings**: Import from previous PyCharm installation or start fresh
2. **UI Theme**: Choose Darcula (dark) or Light theme
3. **Keymap**: Select keymap (Default, Eclipse, Visual Studio, etc.)
4. **Essential Plugins**: Install during initial setup

### Python Interpreter Setup

```bash
# Configure Python interpreter
File → Settings → Project → Python Interpreter

# Add interpreter options:
1. System Interpreter (/usr/bin/python3)
2. Virtual Environment (recommended)
3. Conda Environment
4. Docker
5. Remote Interpreter (SSH, Vagrant, WSL)
```

### Virtual Environment Configuration

```bash
# Create new virtual environment
File → Settings → Project → Python Interpreter → Add Interpreter

# Virtual Environment settings:
Location: ./venv
Base interpreter: Python 3.9
Inherit global site-packages: false
Make available to all projects: false

# Or via terminal in PyCharm:
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

## Essential Plugins

### Python Development

```bash
# Core plugins (usually pre-installed):
- Python                    # Python language support
- Python Community Edition  # Additional Python features

# Database (Professional only)
- Database Tools and SQL     # Database integration

# Web Development
- Django                     # Django framework support
- Flask                      # Flask framework support
- FastAPI                    # FastAPI support
- HTML                       # HTML support
- CSS                        # CSS support
- JavaScript                 # JavaScript support
```

### Code Quality and Productivity

```bash
# Code Quality
- Pylint                     # Python linter
- MyPy                       # Type checking
- Black                      # Code formatter
- isort                      # Import sorting

# Productivity
- .env files support         # Environment file support
- Requirements               # Requirements.txt support
- Jupyter                    # Jupyter notebook support
- Markdown                   # Markdown support
- Rainbow Brackets           # Colorful brackets
- Key Promoter X             # Learn shortcuts
```

### Version Control and Deployment

```bash
# Version Control
- Git                        # Git integration
- GitHub                     # GitHub integration
- GitLab                     # GitLab integration

# Deployment and Cloud
- Docker                     # Docker support
- AWS Toolkit                # AWS integration
- Google Cloud Tools         # GCP integration
- Azure Toolkit              # Azure integration
```

## Project Configuration

### Django Project Setup

```python
# Create Django project
File → New Project → Django

# Project settings:
Location: /path/to/project
Python interpreter: Project venv
Django version: Latest
Template language: Django
Application name: myapp

# Settings configuration
# In settings.py:
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'myproject',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### FastAPI Project Setup

```python
# Create FastAPI project structure
project/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   ├── routers/
│   ├── services/
│   └── database.py
├── tests/
├── requirements.txt
└── README.md

# main.py
from fastapi import FastAPI

app = FastAPI(title="My API", version="1.0.0")

@app.get("/")
async def root():
    return {"message": "Hello World"}

# Run configuration
# Run → Edit Configurations → Add → Python
Script path: app/main.py
Parameters:
Module name: uvicorn
Parameters: app.main:app --reload --host 0.0.0.0 --port 8000
```

### Flask Project Setup

```python
# Create Flask project
File → New Project → Flask

# Project structure:
flask-app/
├── app/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   └── forms.py
├── migrations/
├── tests/
├── config.py
├── requirements.txt
└── run.py

# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)

    from app.views import main
    app.register_blueprint(main)

    return app
```

## Code Style Configuration

### Python Code Style

```python
# Settings → Editor → Code Style → Python

# Tabs and Indents
Tab size: 4
Indent: 4
Continuation indent: 4
Use tab character: false

# Spaces
Before parentheses:
- Method declaration: false
- Method call: false
- Keywords (if, while, etc.): true

# Wrapping and Braces
Right margin: 88 (Black formatter standard)
Wrap on typing: true

# Imports
Sort imports: true
From imports:
- Always place imports on separate lines
- Sort names in from imports
```

### Code Formatters Integration

```bash
# Black formatter setup
Settings → Tools → External Tools → Add

Name: Black
Description: Python code formatter
Program: black
Arguments: $FilePath$
Working directory: $ProjectFileDir$

# Configure Black in PyCharm
Settings → Tools → Black
- Black executable: /path/to/black
- Arguments: --line-length 88
```

### Type Checking with MyPy

```bash
# Install MyPy
pip install mypy

# Configure MyPy external tool
Settings → Tools → External Tools → Add

Name: MyPy
Program: mypy
Arguments: $FilePath$
Working directory: $ProjectFileDir$

# MyPy configuration (mypy.ini)
[mypy]
python_version = 3.9
strict = True
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True
```

## Debugging Configuration

### Basic Debugging

```python
# Set breakpoints: Click in gutter or Ctrl+F8
# Debug modes:
# 1. Debug current file: Right-click → Debug
# 2. Debug configuration: Run → Debug 'configuration'

# Debug toolbar:
# F8: Step over
# F7: Step into
# Shift+F8: Step out
# Alt+F9: Run to cursor
# F9: Resume program

# Evaluate expressions: Alt+F8
# Watch variables: Add to watches panel
```

### Remote Debugging

```python
# Install debugger on remote server
pip install pydevd-pycharm

# Add remote debug configuration
Run → Edit Configurations → Add → Python Debug Server

Name: Remote Debug
IDE host name: localhost
Port: 12345

# In remote code:
import pydevd_pycharm
pydevd_pycharm.settrace('your-ip', port=12345, stdoutToServer=True, stderrToServer=True)
```

### Django Debugging

```python
# Django run configuration
Run → Edit Configurations → Add → Django Server

Name: Django Server
Host: 127.0.0.1
Port: 8000
Environment variables: DJANGO_SETTINGS_MODULE=myproject.settings
Python interpreter: Project interpreter

# Debug Django management commands
Script path: manage.py
Parameters: runserver 127.0.0.1:8000
```

## Database Integration (Professional)

### Database Connection

```python
# Database tool window
View → Tool Windows → Database

# Add PostgreSQL data source
Database → + → Data Source → PostgreSQL

# Connection details:
Host: localhost
Port: 5432
Database: myproject
User: postgres
Password: password
URL: jdbc:postgresql://localhost:5432/myproject

# Test connection and download drivers
```

### Django Models Integration

```python
# Automatic model detection
# PyCharm detects Django models and provides:
# - Code completion for model fields
# - Navigation to model definitions
# - Database console integration

# Example model with PyCharm benefits:
class User(models.Model):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'users'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
```

## Testing Configuration

### PyTest Setup

```python
# Install pytest
pip install pytest pytest-django pytest-cov

# Settings → Tools → Python Integrated Tools
Default test runner: pytest

# Test configuration
Run → Edit Configurations → Add → Python tests → pytest

Target: Custom
Target: tests/
Additional Arguments: -v --cov=app --cov-report=html

# Example test file: tests/test_models.py
import pytest
from django.test import TestCase
from app.models import User

class TestUserModel(TestCase):
    def test_user_creation(self):
        user = User.objects.create(
            email="test@example.com",
            first_name="John",
            last_name="Doe"
        )
        assert user.email == "test@example.com"
        assert str(user) == "John Doe"
```

### Django Testing

```python
# Django test configuration
Run → Edit Configurations → Add → Django tests

Target: app.tests
Settings: myproject.settings.test

# Test database settings (settings/test.py):
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Example Django test:
from django.test import TestCase, Client
from django.contrib.auth.models import User

class ViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass'
        )

    def test_home_view(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
```

## Package Management

### Requirements Management

```python
# requirements.txt
Django==4.2.7
psycopg2-binary==2.9.9
python-decouple==3.8
django-cors-headers==4.3.1

# Development requirements (requirements-dev.txt)
pytest==7.4.3
pytest-django==4.7.0
black==23.11.0
mypy==1.7.1
pylint==3.0.3

# Install requirements
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### Poetry Integration

```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Initialize Poetry project
poetry init

# pyproject.toml
[tool.poetry]
name = "myproject"
version = "0.1.0"
description = "My Python project"

[tool.poetry.dependencies]
python = "^3.9"
django = "^4.2"
psycopg2-binary = "^2.9"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4"
black = "^23.11"
mypy = "^1.7"

# Configure PyCharm to use Poetry
Settings → Project → Python Interpreter → Add → Poetry Environment
```

## Performance Optimization

### Memory Settings

```bash
# Increase PyCharm memory
Help → Edit Custom VM Options

# Add to pycharm.vmoptions:
-Xmx4g
-Xms2g
-XX:+UseG1GC
-XX:MaxGCPauseMillis=200

# For large projects:
-Xmx8g
-Xms4g
```

### Indexing Optimization

```bash
# Exclude directories from indexing
Settings → Project → Directories

# Mark as excluded:
- venv/
- __pycache__/
- .pytest_cache/
- node_modules/
- .git/
- migrations/ (if not needed for navigation)

# File types to exclude
Settings → Editor → File Types → Ignored Files and Folders
Add patterns: *.pyc; *.pyo; __pycache__
```

## Live Templates

### Custom Python Templates

```python
# Settings → Editor → Live Templates → Python

# main - if __name__ == "__main__"
if __name__ == "__main__":
    $END$

# pdb - debugger breakpoint
import pdb; pdb.set_trace()

# logger - logging setup
import logging

logger = logging.getLogger(__name__)

# test - pytest test method
def test_$NAME$():
    # given
    $GIVEN$

    # when
    $WHEN$

    # then
    $THEN$

# class - class with docstring
class $NAME$:
    """$DOCSTRING$."""

    def __init__(self):
        $END$
```

### Django Templates

```python
# model - Django model
class $NAME$(models.Model):
    """$DOCSTRING$."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = '$TABLE$'
        ordering = ['created_at']

    def __str__(self):
        return f"$NAME$ {self.pk}"

# view - Django view
class $NAME$View(View):
    """$DOCSTRING$."""

    def get(self, request):
        $END$
        return render(request, '$TEMPLATE$', context)

# serializer - DRF Serializer
class $NAME$Serializer(serializers.ModelSerializer):
    """$DOCSTRING$."""

    class Meta:
        model = $MODEL$
        fields = '__all__'
```

## Troubleshooting

### Common Issues

#### Import Resolution Problems

```python
# Mark directories as source roots
Right-click directory → Mark Directory as → Sources Root

# Configure PYTHONPATH
Run → Edit Configurations → Environment Variables
Add: PYTHONPATH=/path/to/project/root
```

#### Virtual Environment Issues

```bash
# Recreate virtual environment
rm -rf venv/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Update interpreter in PyCharm
Settings → Project → Python Interpreter → Show All → Remove → Add
```

#### Django Settings Issues

```python
# Configure Django settings
Settings → Languages & Frameworks → Django

# Enable Django support: ✓
# Django project root: /path/to/project
# Settings: myproject/settings.py
# Manage script: manage.py
```

This comprehensive PyCharm setup provides an optimal Python development environment with Django, FastAPI, and Flask support.
