# Python Dependency Management

This file covers best practices for managing Python dependencies across different projects and environments.

## Package Managers

### pip (Standard)
- Built into Python
- Works with requirements.txt
- Basic dependency resolution

### Poetry (Recommended)
- Modern dependency management
- Lock file support
- Virtual environment integration
- Better dependency resolution

### pipenv
- Combines pip and virtualenv
- Pipfile and Pipfile.lock
- Good for simple projects

## Virtual Environments

```bash
# Create virtual environment
python -m venv myenv

# Activate (Linux/Mac)
source myenv/bin/activate

# Activate (Windows)
myenv\Scripts\activate

# Deactivate
deactivate
```

## Poetry Workflow

```bash
# Initialize new project
poetry init

# Add dependencies
poetry add fastapi uvicorn

# Add development dependencies
poetry add --group dev pytest black flake8

# Install dependencies
poetry install

# Run commands in environment
poetry run python app.py

# Update dependencies
poetry update
```

## Requirements Files

```txt
# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0

# requirements-dev.txt
pytest==7.4.3
black==23.11.0
flake8==6.1.0
```

## Best Practices

- Always use virtual environments
- Pin exact versions in production
- Separate development and production dependencies
- Use lock files for reproducible builds
- Regularly update dependencies
- Document installation instructions