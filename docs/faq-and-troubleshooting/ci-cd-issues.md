# CI/CD Issues

This file addresses common continuous integration and continuous deployment problems and their solutions.

## GitHub Actions Issues

### Workflow Not Triggering

#### Common Causes

- Workflow file not in `.github/workflows/` directory
- YAML syntax errors
- Incorrect trigger configuration
- Branch protection rules blocking workflow

#### Solutions

```yaml
# Check workflow file location
.github/
  workflows/
    ci.yml  # Must be in this directory

# Verify trigger syntax
name: CI
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

# Check for YAML syntax errors
# Use online YAML validator or:
yamllint .github/workflows/ci.yml
```

#### Debug Steps

```bash
# Check workflow runs in GitHub UI
# Go to Actions tab in repository

# Verify webhook deliveries
# Settings → Webhooks → View deliveries

# Check branch protection rules
# Settings → Branches → Protection rules
```

### Authentication and Permissions

#### Secrets Not Available

```yaml
# Error: Secret not found
- name: Deploy
  env:
    API_KEY: ${{ secrets.API_KEY }} # Secret not set
```

**Solutions:**

```bash
# Add secrets in GitHub repository:
# Settings → Secrets and variables → Actions → New repository secret

# For organization secrets:
# Organization Settings → Secrets and variables → Actions

# Check secret availability in workflow
- name: Check secrets
  run: |
    if [ -z "${{ secrets.API_KEY }}" ]; then
      echo "API_KEY secret not found"
      exit 1
    fi
```

#### Permission Denied Errors

```yaml
# Error: Permission denied when pushing/deploying
- name: Deploy
  run: |
    git push origin main  # May fail without proper permissions
```

**Solutions:**

```yaml
# Use GitHub token for Git operations
- name: Deploy
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    git config --global user.name "github-actions[bot]"
    git config --global user.email "github-actions[bot]@users.noreply.github.com"
    git push https://$GITHUB_TOKEN@github.com/${{ github.repository }}.git

# Set proper permissions for workflow
permissions:
  contents: write
  packages: read
  deployments: write
```

### Build Failures

#### Dependency Installation Issues

```yaml
# Node.js dependency issues
- name: Install dependencies
  run: npm ci # May fail due to package-lock.json issues
```

**Solutions:**

```yaml
# Use caching for dependencies
- name: Cache Node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Install dependencies
  run: |
    npm ci --prefer-offline --no-audit

# For Python projects
- name: Cache pip dependencies
  uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-

- name: Install dependencies
  run: |
    python -m pip install --upgrade pip
    pip install -r requirements.txt
```

#### Environment Issues

```yaml
# Wrong Node.js version
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: "16" # May not match local development
```

**Solutions:**

```yaml
# Use matrix builds for multiple versions
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]

steps:
  - name: Setup Node.js ${{ matrix.node-version }}
    uses: actions/setup-node@v3
    with:
      node-version: ${{ matrix.node-version }}

  # Use .nvmrc file for consistency
  - name: Read .nvmrc
    run: echo "node_version=$(cat .nvmrc)" >> $GITHUB_OUTPUT
    id: nvmrc

  - name: Setup Node.js
    uses: actions/setup-node@v3
    with:
      node-version: ${{ steps.nvmrc.outputs.node_version }}
```

### Testing Issues

#### Test Failures in CI but Pass Locally

```yaml
# Tests fail due to environment differences
- name: Run tests
  run: npm test
```

**Common Causes and Solutions:**

1. **Timezone differences**

```yaml
- name: Run tests
  env:
    TZ: UTC
  run: npm test
```

2. **Database/service dependencies**

```yaml
# Use service containers
services:
  postgres:
    image: postgres:14
    env:
      POSTGRES_PASSWORD: password
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
    ports:
      - 5432:5432

- name: Run tests
  env:
    DATABASE_URL: postgresql://postgres:password@localhost:5432/test
  run: npm test
```

3. **Race conditions**

```yaml
- name: Wait for services
  run: |
    npx wait-on http://localhost:3000
    npx wait-on tcp:localhost:5432
```

#### Flaky Tests

```yaml
# Tests pass/fail randomly
- name: Run tests with retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: npm test
```

### Deployment Issues

#### Docker Build Failures

```yaml
# Docker build context issues
- name: Build Docker image
  run: |
    docker build -t myapp .  # May fail due to context
```

**Solutions:**

```yaml
# Use Docker Buildx action
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v2

- name: Build and push
  uses: docker/build-push-action@v4
  with:
    context: .
    push: true
    tags: myregistry/myapp:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max

# Multi-stage build optimization
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
```

#### AWS Deployment Issues

```yaml
# AWS credentials not configured
- name: Deploy to AWS
  run: |
    aws s3 sync dist/ s3://my-bucket/  # May fail without credentials
```

**Solutions:**

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Deploy to S3
  run: |
    aws s3 sync dist/ s3://my-bucket/ --delete
    aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

## Jenkins Issues

### Pipeline Syntax Errors

#### Groovy Syntax Issues

```groovy
// Common syntax errors
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'  // Missing quotes around shell commands
                sh npm test       // Wrong: should be quoted
            }
        }
    }
}
```

**Solutions:**

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm test'

                // For multi-line commands
                sh '''
                    npm install
                    npm run build
                    npm test
                '''
            }
        }
    }
}

// Use Jenkins pipeline syntax generator
// Jenkins → Pipeline Syntax → Snippet Generator
```

### Agent and Node Issues

#### No Available Agents

```groovy
pipeline {
    agent { label 'nonexistent-label' }  // No agents with this label
}
```

**Solutions:**

```groovy
// Use any available agent
pipeline {
    agent any
    // ...
}

// Use specific agent with fallback
pipeline {
    agent {
        label 'docker || linux'
    }
    // ...
}

// Use none and specify per stage
pipeline {
    agent none
    stages {
        stage('Build') {
            agent { label 'build-agent' }
            steps {
                sh 'make build'
            }
        }
        stage('Test') {
            agent { label 'test-agent' }
            steps {
                sh 'make test'
            }
        }
    }
}
```

### Plugin Issues

#### Missing Plugins

```groovy
// Using plugins that aren't installed
pipeline {
    stages {
        stage('Deploy') {
            steps {
                publishHTML([  // Requires HTML Publisher plugin
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: true,
                    reportDir: 'coverage',
                    reportFiles: 'index.html',
                    reportName: 'Coverage Report'
                ])
            }
        }
    }
}
```

**Solutions:**

1. Install required plugins through Jenkins UI
2. Use plugin manager CLI

```bash
java -jar jenkins-cli.jar -s http://localhost:8080/ install-plugin html-publisher
```

3. Check plugin compatibility

```groovy
// Check if plugin is available
if (Jenkins.instance.pluginManager.getPlugin('html-publisher')) {
    publishHTML([...])
} else {
    echo 'HTML Publisher plugin not available'
}
```

## GitLab CI Issues

### Runner Problems

#### No Runners Available

```yaml
# .gitlab-ci.yml
test:
  script:
    - npm test
  tags:
    - nonexistent-tag # No runners with this tag
```

**Solutions:**

```yaml
# Use shared runners
test:
  script:
    - npm test
  # Remove tags to use shared runners

# Or use specific runner tags
test:
  script:
    - npm test
  tags:
    - docker
    - linux

# Check available runners in GitLab UI
# Settings → CI/CD → Runners
```

#### Runner Configuration Issues

```yaml
# Docker-in-Docker issues
build:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t myapp . # May fail without proper setup
```

**Solutions:**

```yaml
# Proper Docker-in-Docker setup
build:
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_HOST: tcp://docker:2376
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker info
  script:
    - docker build -t myapp .
```

### Cache and Artifacts Issues

#### Cache Not Working

```yaml
# Cache configuration issues
test:
  cache:
    paths:
      - node_modules/ # May not be restored properly
  script:
    - npm install
    - npm test
```

**Solutions:**

```yaml
# Proper cache configuration
test:
  cache:
    key: ${CI_COMMIT_REF_SLUG}
    paths:
      - node_modules/
    policy: pull-push
  before_script:
    - npm ci --cache .npm --prefer-offline
  script:
    - npm test
  artifacts:
    paths:
      - coverage/
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
```

## General CI/CD Debugging

### Performance Issues

#### Slow Build Times

**Optimization Strategies:**

```yaml
# Use caching effectively
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      ~/.cache/pip
      ~/.m2/repository
    key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json', '**/requirements.txt', '**/pom.xml') }}

# Parallel job execution
strategy:
  matrix:
    include:
      - name: "Unit Tests"
        command: "npm run test:unit"
      - name: "Integration Tests"
        command: "npm run test:integration"
      - name: "E2E Tests"
        command: "npm run test:e2e"

# Use faster runners
runs-on: ubuntu-latest  # Generally faster than other options
```

#### Resource Constraints

```yaml
# Monitor resource usage
- name: Monitor resources
  run: |
    echo "Disk usage:"
    df -h
    echo "Memory usage:"
    free -h
    echo "CPU info:"
    nproc
```

### Security Issues

#### Exposed Secrets

```bash
# Check for accidentally committed secrets
git log --grep="password\|secret\|key" --oneline

# Use secret scanning tools
npm audit
safety check  # Python
snyk test
```

**Prevention:**

```yaml
# Use environment-specific secrets
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  env:
    API_KEY: ${{ secrets.STAGING_API_KEY }}
  run: deploy-staging.sh

- name: Deploy to production
  if: github.ref == 'refs/heads/main'
  env:
    API_KEY: ${{ secrets.PRODUCTION_API_KEY }}
  run: deploy-production.sh
```

### Monitoring and Debugging

#### Enable Debug Logging

```yaml
# GitHub Actions
- name: Enable debug logging
  run: echo "ACTIONS_STEP_DEBUG=true" >> $GITHUB_ENV

# GitLab CI
variables:
  CI_DEBUG_TRACE: "true"

# Jenkins
// Enable debug in pipeline
pipeline {
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }
    // ...
}
```

#### Troubleshooting Steps

1. **Check workflow/pipeline status** in UI
2. **Review logs** for error messages
3. **Verify configuration** files
4. **Test locally** with same commands
5. **Check resource availability** (agents, secrets, permissions)
6. **Validate dependencies** and versions
7. **Monitor resource usage** (CPU, memory, disk)

### Common Anti-patterns

#### Don't Do This

```yaml
# Hardcoded values
- name: Deploy
  run: |
    ssh user@192.168.1.100 'cd /app && git pull'  # Hardcoded IP

# No error handling
- name: Deploy
  run: |
    ./deploy.sh
    # No check if deployment succeeded

# Overly complex single job
- name: Everything
  run: |
    npm install
    npm test
    npm run build
    docker build -t app .
    docker push app
    kubectl apply -f k8s/
    # Should be separate jobs
```

#### Best Practices

```yaml
# Use environment variables
- name: Deploy
  env:
    DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
    DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
  run: |
    ssh $DEPLOY_USER@$DEPLOY_HOST 'cd /app && git pull'

# Proper error handling
- name: Deploy
  run: |
    if ./deploy.sh; then
      echo "Deployment successful"
    else
      echo "Deployment failed"
      exit 1
    fi

# Separate concerns into different jobs
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run tests
        run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build application
        run: npm run build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        run: ./deploy.sh
```

### Emergency Procedures

#### Rollback Strategies

```bash
# GitHub Actions - revert commit
git revert HEAD~1
git push origin main

# Manual rollback with tags
git tag -l | grep release
git checkout tags/v1.2.3
git checkout -b hotfix/rollback-v1.2.4
# Make minimal fixes
git tag v1.2.5
git push origin v1.2.5

# Container rollback
docker pull myapp:previous-version
docker stop myapp
docker run -d --name myapp myapp:previous-version
```

#### When to Contact Support

- Pipeline has been failing for >30 minutes
- Security incident detected
- Unable to deploy critical hotfix
- Resource constraints affecting multiple pipelines
- Suspected platform issues (GitHub/GitLab/Jenkins down)
