# Setting Up Local Environment

This file provides step-by-step instructions for setting up a complete development environment.

## Prerequisites

Before starting, ensure you have administrative access to your machine and a stable internet connection.

## Operating System Setup

### macOS Setup

#### Install Homebrew

```bash
# Install Homebrew (package manager for macOS)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

#### Install Essential Tools

```bash
# Development tools
brew install git node python@3.11 java docker postgresql redis

# Optional but recommended
brew install --cask visual-studio-code intellij-idea-ce postman docker-desktop
```

### Windows Setup

#### Install Chocolatey

```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

#### Install Essential Tools

```powershell
# Development tools
choco install git nodejs python java docker-desktop postgresql redis-64 -y

# IDEs and editors
choco install vscode intellijidea-community postman -y
```

### Linux (Ubuntu/Debian) Setup

#### Update System

```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Essential Tools

```bash
# Development tools
sudo apt install -y git curl wget build-essential

# Node.js (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Python
sudo apt install -y python3 python3-pip python3-venv

# Java
sudo apt install -y openjdk-17-jdk

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Redis
sudo apt install -y redis-server
```

## Development Tools Installation

### Git Configuration

```bash
# Set up your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"

# Set up default branch name
git config --global init.defaultBranch main

# Useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.lg "log --oneline --graph --decorate"

# Enable credential helper (macOS)
git config --global credential.helper osxkeychain

# Enable credential helper (Windows)
git config --global credential.helper manager-core

# Enable credential helper (Linux)
git config --global credential.helper cache
```

### SSH Key Setup

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@company.com"

# Add to SSH agent (macOS/Linux)
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard (macOS)
pbcopy < ~/.ssh/id_ed25519.pub

# Copy public key to clipboard (Linux)
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# Copy public key to clipboard (Windows)
clip < ~/.ssh/id_ed25519.pub
```

Add the copied public key to your GitHub account: Settings → SSH and GPG keys → New SSH key

### Python Environment Setup

#### Install Poetry (Recommended)

```bash
# Install Poetry
curl -sSL https://install.python-poetry.org | python3 -

# Add Poetry to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Configure Poetry
poetry config virtualenvs.in-project true
```

#### Alternative: Traditional Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install common packages
pip install --upgrade pip
pip install requests fastapi uvicorn pytest black flake8
```

### Node.js Environment Setup

#### Install Node Version Manager (Optional but Recommended)

```bash
# Install nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install and use latest LTS Node.js
nvm install --lts
nvm use --lts
nvm alias default node
```

#### Install Global Packages

```bash
npm install -g @angular/cli create-react-app typescript ts-node nodemon
```

### Java Environment Setup

#### Set JAVA_HOME

```bash
# macOS (add to ~/.zshrc or ~/.bash_profile)
export JAVA_HOME=$(/usr/libexec/java_home)

# Linux (add to ~/.bashrc)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

# Windows (set environment variable)
# JAVA_HOME = C:\Program Files\Java\jdk-17
```

#### Install Maven

```bash
# macOS
brew install maven

# Linux
sudo apt install maven

# Windows
choco install maven
```

## Database Setup

### PostgreSQL Configuration

```bash
# Start PostgreSQL service
# macOS (if installed via Homebrew)
brew services start postgresql

# Linux
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create development database
createdb devdb

# Connect to PostgreSQL
psql postgres

-- Create development user
CREATE USER devuser WITH ENCRYPTED PASSWORD 'devpassword';
GRANT ALL PRIVILEGES ON DATABASE devdb TO devuser;
ALTER USER devuser CREATEDB;
\q
```

### Redis Configuration

```bash
# Start Redis service
# macOS
brew services start redis

# Linux
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis connection
redis-cli ping
# Should return: PONG
```

## Docker Setup

### Docker Desktop Installation

1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Install and start Docker Desktop
3. Sign in to Docker Hub (optional but recommended)

### Verify Docker Installation

```bash
# Check Docker version
docker --version
docker-compose --version

# Test Docker installation
docker run hello-world

# Pull common base images
docker pull node:18-alpine
docker pull python:3.11-slim
docker pull postgres:14
docker pull redis:7-alpine
```

## IDE Configuration

### Visual Studio Code Setup

#### Install Essential Extensions

```bash
# Install VS Code extensions via command line
code --install-extension ms-python.python
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-json
code --install-extension redhat.vscode-yaml
code --install-extension ms-vscode-remote.remote-containers
code --install-extension GitHub.copilot
```

#### Configure Settings

Create `.vscode/settings.json` in your workspace:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.rulers": [80, 120],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true
}
```

### IntelliJ IDEA Setup

#### Install Plugins

- Python (if using IntelliJ IDEA Ultimate)
- Docker
- GitToolBox
- Rainbow Brackets
- SonarLint

#### Configure Code Style

1. Go to Settings → Editor → Code Style
2. Import scheme from company style guide
3. Set line length to 120 characters
4. Enable auto-formatting on save

## Environment Variables

### Create Environment Files

```bash
# Create global environment file
touch ~/.env

# Add common environment variables
echo 'export DATABASE_URL="postgresql://devuser:devpassword@localhost:5432/devdb"' >> ~/.env
echo 'export REDIS_URL="redis://localhost:6379"' >> ~/.env
echo 'export NODE_ENV="development"' >> ~/.env
echo 'export PYTHON_ENV="development"' >> ~/.env

# Source the file
source ~/.env

# Add to shell profile
echo 'source ~/.env' >> ~/.bashrc
```

## Testing the Setup

### Clone and Run Sample Project

```bash
# Clone our template repository
git clone https://github.com/EndToEndLabCR/template-api-python.git
cd template-api-python

# Set up Python environment
poetry install  # or pip install -r requirements.txt

# Run the application
poetry run uvicorn app.main:app --reload

# Test in another terminal
curl http://localhost:8000/health
```

### Verify All Tools

```bash
# Check all installations
echo "=== Tool Versions ==="
git --version
node --version
npm --version
python3 --version
java -version
mvn --version
docker --version
psql --version
redis-cli --version

echo "=== Service Status ==="
# Test database connection
psql -h localhost -U devuser -d devdb -c "SELECT version();"

# Test Redis connection
redis-cli ping

# Test Docker
docker run --rm hello-world
```

## Troubleshooting Common Issues

### Permission Issues (macOS/Linux)

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Fix Docker permissions (Linux)
sudo usermod -aG docker $USER
# Log out and log back in
```

### PATH Issues

```bash
# Check your PATH
echo $PATH

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc for zsh
```

### Port Conflicts

```bash
# Check what's running on common ports
lsof -i :3000  # React development server
lsof -i :8000  # FastAPI/Django
lsof -i :8080  # Spring Boot
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Kill process if needed
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
ps aux | grep postgres

# Check PostgreSQL logs
# macOS: tail -f /opt/homebrew/var/log/postgres.log
# Linux: sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Reset PostgreSQL password
sudo -u postgres psql
\password postgres
```

## Next Steps

After completing the setup:

1. Join the team Slack channels
2. Request access to development environments
3. Clone and explore our template projects
4. Complete the onboarding guide
5. Ask your buddy or team lead for your first task

## Maintenance

### Regular Updates

```bash
# Update Homebrew packages (macOS)
brew update && brew upgrade

# Update apt packages (Linux)
sudo apt update && sudo apt upgrade

# Update npm packages
npm update -g

# Update Python packages
pip list --outdated
poetry update  # if using Poetry
```

### Backup Configuration

- Export VS Code settings and extensions
- Backup your SSH keys securely
- Document any custom configurations
- Keep a list of installed packages and tools
