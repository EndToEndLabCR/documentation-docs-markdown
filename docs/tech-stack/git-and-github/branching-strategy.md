# Branching Strategy

This file outlines our Git branching strategy and workflow for collaborative development.

## GitFlow Workflow

### Main Branches
- **main**: Production-ready code
- **develop**: Integration branch for features

### Supporting Branches
- **feature**: New features (`feature/feature-name`)
- **release**: Release preparation (`release/v1.2.0`)
- **hotfix**: Critical production fixes (`hotfix/fix-name`)

## Branch Naming Conventions

### Feature Branches
```bash
feature/user-authentication
feature/payment-integration
feature/dashboard-redesign
```

### Bug Fix Branches
```bash
bugfix/login-error
bugfix/memory-leak
```

### Hotfix Branches
```bash
hotfix/security-patch
hotfix/critical-bug
```

## Workflow Example

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/new-dashboard

# Work on feature
git add .
git commit -m "feat: add dashboard components"
git push origin feature/new-dashboard

# Create pull request to develop
# After approval and merge, delete feature branch
git checkout develop
git pull origin develop
git branch -d feature/new-dashboard
```

## Release Process

```bash
# Create release branch
git checkout develop
git checkout -b release/v1.2.0

# Finalize release
git commit -m "chore: bump version to 1.2.0"

# Merge to main and develop
git checkout main
git merge release/v1.2.0
git tag v1.2.0

git checkout develop
git merge release/v1.2.0
```

## Best Practices

- Keep feature branches short-lived
- Regularly sync with develop
- Use descriptive branch names
- Delete merged branches
- Tag releases consistently
- Write meaningful commit messages