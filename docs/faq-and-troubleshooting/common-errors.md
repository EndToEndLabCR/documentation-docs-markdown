# Common Errors

This file documents common errors encountered during development and their solutions.

## Build and Compilation Errors

### Node.js / npm Errors

#### Error: Module not found

```bash
Error: Cannot find module 'some-package'
```

**Solutions:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Install missing package
npm install some-package

# Check if package is listed in package.json
npm list some-package
```

#### Error: Permission denied (EACCES)

```bash
Error: EACCES: permission denied, mkdir '/usr/local/lib/node_modules'
```

**Solutions:**

```bash
# Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Alternative: Use nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

#### Error: Heap out of memory

```bash
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solutions:**

```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 your-script.js

# Or set environment variable
export NODE_OPTIONS="--max-old-space-size=4096"

# For npm scripts, update package.json
"scripts": {
  "build": "node --max-old-space-size=4096 ./build.js"
}
```

### Python Errors

#### ImportError: No module named 'package'

```python
ImportError: No module named 'requests'
```

**Solutions:**

```bash
# Install missing package
pip install requests

# Check if virtual environment is activated
which python
source venv/bin/activate  # Activate if needed

# Install from requirements.txt
pip install -r requirements.txt

# Check installed packages
pip list
pip show requests
```

#### SyntaxError: invalid syntax

```python
SyntaxError: invalid syntax
```

**Common Causes and Solutions:**

- **Python version mismatch**: Check `python --version`, use correct version
- **Indentation errors**: Use consistent spaces or tabs (prefer 4 spaces)
- **Missing parentheses**: f-strings require Python 3.6+
- **Encoding issues**: Add `# -*- coding: utf-8 -*-` at file top

#### ModuleNotFoundError with relative imports

```python
ModuleNotFoundError: No module named 'mymodule'
```

**Solutions:**

```bash
# Run as module instead of script
python -m mypackage.myscript

# Add to PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:/path/to/your/project"

# Use absolute imports in your code
from mypackage.mymodule import MyClass
```

### Java Errors

#### ClassNotFoundException

```java
Exception in thread "main" java.lang.ClassNotFoundException: com.example.MyClass
```

**Solutions:**

```bash
# Check classpath
java -cp "/path/to/classes:/path/to/libs/*" com.example.MyClass

# Verify package structure matches directory structure
# com.example.MyClass should be in com/example/MyClass.java

# Clean and rebuild
mvn clean compile
./gradlew clean build
```

#### OutOfMemoryError

```java
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
```

**Solutions:**

```bash
# Increase heap size
java -Xmx2g -Xms1g MyApplication

# For Maven
export MAVEN_OPTS="-Xmx2g -Xms1g"

# For Gradle
export GRADLE_OPTS="-Xmx2g -Xms1g"

# In IDE, update run configuration VM options
-Xmx2g -Xms1g
```

#### NoSuchMethodError

```java
Exception in thread "main" java.lang.NoSuchMethodError
```

**Solutions:**

- Check dependency versions for conflicts
- Update/downgrade conflicting libraries
- Clear compilation cache and rebuild
- Verify method signatures match between versions

## Database Errors

### PostgreSQL Errors

#### Connection refused

```
psql: could not connect to server: Connection refused
```

**Solutions:**

```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql
brew services start postgresql

# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql

# Check port and host
psql -h localhost -p 5432 -U username -d database

# Check pg_hba.conf for authentication settings
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

#### Authentication failed

```
psql: FATAL: password authentication failed for user "username"
```

**Solutions:**

```bash
# Reset password
sudo -u postgres psql
ALTER USER username PASSWORD 'newpassword';

# Check pg_hba.conf authentication method
# Change 'md5' to 'trust' temporarily for testing

# Use correct connection string
postgresql://username:password@localhost:5432/database
```

#### Database does not exist

```
psql: FATAL: database "mydb" does not exist
```

**Solutions:**

```bash
# List databases
psql -U postgres -l

# Create database
createdb mydb
# or
psql -U postgres -c "CREATE DATABASE mydb;"

# Connect to existing database first
psql -U postgres -d postgres -c "CREATE DATABASE mydb;"
```

### MongoDB Errors

#### Connection timeout

```
pymongo.errors.ServerSelectionTimeoutError: No servers found yet
```

**Solutions:**

```bash
# Check MongoDB service
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Check connection string
mongodb://localhost:27017/mydatabase

# Verify network connectivity
telnet localhost 27017
```

#### Authentication failed

```
pymongo.errors.OperationFailure: Authentication failed
```

**Solutions:**

```javascript
// Create user with proper roles
use admin
db.createUser({
  user: "myuser",
  pwd: "mypassword",
  roles: ["readWriteAnyDatabase"]
})

// Use correct connection string
mongodb://myuser:mypassword@localhost:27017/mydatabase?authSource=admin
```

## Docker Errors

### Image build failures

#### Error: failed to solve with frontend dockerfile.v0

```
Error: failed to solve with frontend dockerfile.v0
```

**Solutions:**

```bash
# Check Dockerfile syntax
docker build --no-cache -t myapp .

# Verify base image exists
docker pull node:18-alpine

# Check file paths in COPY instructions
COPY package*.json ./
COPY . .

# Use .dockerignore to exclude unnecessary files
echo "node_modules" >> .dockerignore
echo ".git" >> .dockerignore
```

#### Error: Cannot connect to the Docker daemon

```
Error: Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Solutions:**

```bash
# Start Docker service
# macOS: Start Docker Desktop
# Linux
sudo systemctl start docker

# Add user to docker group (Linux)
sudo usermod -aG docker $USER
# Log out and log back in

# Check Docker daemon status
sudo systemctl status docker
docker version
```

### Container runtime errors

#### Port already in use

```
Error: bind: address already in use
```

**Solutions:**

```bash
# Find process using the port
lsof -i :8080
netstat -tulpn | grep :8080

# Kill the process
kill -9 <PID>

# Use different port
docker run -p 8081:8080 myapp

# Stop conflicting container
docker ps
docker stop container_name
```

#### Container exits immediately

```
Container exits with code 0 or 1
```

**Solutions:**

```bash
# Check container logs
docker logs container_name

# Run interactively for debugging
docker run -it myapp /bin/bash

# Check if main process exits
# Ensure your Dockerfile CMD keeps container running
CMD ["npm", "start"]  # Not CMD ["npm", "run", "build"]

# Use proper init system for multiple processes
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

## API and Network Errors

### HTTP Status Code Errors

#### 400 Bad Request

**Common Causes:**

- Invalid JSON format in request body
- Missing required parameters
- Invalid parameter types

**Debug Steps:**

```bash
# Validate JSON
echo '{"key": "value"}' | jq .

# Check request format
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@example.com"}' \
  http://localhost:8000/users
```

#### 401 Unauthorized

**Common Causes:**

- Missing authentication token
- Expired token
- Invalid token format

**Debug Steps:**

```bash
# Check token format
curl -H "Authorization: Bearer your-token" http://localhost:8000/protected

# Verify token expiration
# Decode JWT token at jwt.io

# Check authentication middleware
console.log('Token:', req.headers.authorization);
```

#### 404 Not Found

**Common Causes:**

- Incorrect URL path
- Route not registered
- Case sensitivity issues

**Debug Steps:**

```bash
# List available routes (Express.js)
app._router.stack.forEach(r => console.log(r.route?.path));

# Check route registration order
# Specific routes before general ones
app.get('/users/:id', handler);
app.get('/users/*', catchAll);  // This should come after
```

#### 500 Internal Server Error

**Debug Steps:**

```bash
# Check server logs
tail -f /var/log/app.log

# Enable debug mode
NODE_ENV=development npm start

# Add error handling
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
});
```

### CORS Errors

#### Access-Control-Allow-Origin

```
Access to fetch at 'http://api.example.com' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**Solutions:**

```javascript
// Express.js
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:3000', 'https://myapp.com'],
  credentials: true
}));

// FastAPI
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

// Manual headers
res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

## Git Errors

### Common Git Issues

#### fatal: not a git repository

```bash
fatal: not a git repository (or any of the parent directories): .git
```

**Solutions:**

```bash
# Initialize git repository
git init

# Check if you're in the right directory
pwd
ls -la | grep .git

# Clone repository if it exists remotely
git clone https://github.com/user/repo.git
```

#### fatal: remote origin already exists

```bash
fatal: remote origin already exists
```

**Solutions:**

```bash
# Remove existing remote
git remote remove origin

# Or update existing remote
git remote set-url origin https://github.com/user/new-repo.git

# List current remotes
git remote -v
```

#### Your branch is ahead of 'origin/main'

```bash
Your branch is ahead of 'origin/main' by 2 commits
```

**Solutions:**

```bash
# Push commits to remote
git push origin main

# Reset to remote state (lose local commits)
git reset --hard origin/main

# Rebase onto remote
git rebase origin/main
```

#### Merge conflicts

```bash
CONFLICT (content): Merge conflict in file.txt
```

**Solutions:**

```bash
# View conflicted files
git status

# Edit files to resolve conflicts
# Look for conflict markers:
<<<<<<< HEAD
Your changes
=======
Other changes
>>>>>>> branch-name

# After resolving conflicts
git add file.txt
git commit -m "Resolve merge conflicts"

# Use merge tool
git mergetool
```

## Environment-Specific Errors

### Development Environment

#### Port conflicts

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Use different port
PORT=3001 npm start

# In code
const PORT = process.env.PORT || 3001;
```

#### Environment variables not loaded

**Solutions:**

```bash
# Check if .env file exists
ls -la .env

# Load environment variables
# Node.js
require('dotenv').config();

# Python
from python-dotenv import load_dotenv
load_dotenv()

# Verify variables are loaded
console.log('DB_URL:', process.env.DATABASE_URL);
```

### Production Environment

#### Memory leaks

**Debug Steps:**

```bash
# Monitor memory usage
top -p $(pgrep node)

# Node.js heap dump
kill -USR2 $(pgrep node)

# Python memory profiling
pip install memory-profiler
@profile
def my_function():
    pass
```

#### SSL certificate errors

```bash
Error: unable to verify the first certificate
```

**Solutions:**

```bash
# Check certificate validity
openssl x509 -in certificate.crt -text -noout

# Update certificate bundle
npm config set ca ""
pip install --trusted-host pypi.org --trusted-host pypi.python.org package

# Disable SSL verification (NOT for production)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Performance Issues

### Slow Database Queries

```sql
-- Find slow queries (PostgreSQL)
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Add indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Use EXPLAIN to analyze query plans
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

### High Memory Usage

```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head

# Node.js memory profiling
node --inspect --max-old-space-size=4096 app.js
# Open chrome://inspect in Chrome

# Python memory profiling
import tracemalloc
tracemalloc.start()
# ... your code ...
current, peak = tracemalloc.get_traced_memory()
print(f"Current memory usage: {current / 1024 / 1024:.1f} MB")
```

### High CPU Usage

```bash
# Find CPU-intensive processes
top -o %CPU

# Profile Node.js application
node --prof app.js
node --prof-process isolate-0x*.log > processed.txt

# Python profiling
python -m cProfile -o profile.stats script.py
python -c "import pstats; pstats.Stats('profile.stats').sort_stats('cumulative').print_stats()"
```

## Getting Help

### When to Escalate

1. Security-related errors
2. Production system failures
3. Data corruption issues
4. Issues affecting multiple team members
5. Problems persisting after 30+ minutes of troubleshooting

### Debugging Information to Gather

- Exact error message and stack trace
- Steps to reproduce the issue
- Environment details (OS, versions, etc.)
- Recent changes made
- Logs before and after the error
- Screenshots or screen recordings if applicable

### Useful Commands for Information Gathering

```bash
# System information
uname -a
cat /etc/os-release
docker version
node --version
python --version
java -version

# Process information
ps aux | grep process_name
netstat -tulpn
lsof -i :port_number

# Log files
tail -f /var/log/application.log
journalctl -u service_name -f
docker logs -f container_name
```
