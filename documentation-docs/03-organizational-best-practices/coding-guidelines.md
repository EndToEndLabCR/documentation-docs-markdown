# Coding Guidelines

This file establishes coding standards and guidelines for consistent, maintainable code across all projects.

## General Principles

### Code Quality
- Write code that is easy to read and understand
- Follow the principle of least surprise
- Keep functions and classes focused on single responsibilities
- Use meaningful names for variables, functions, and classes

### Consistency
- Follow established patterns within the codebase
- Use consistent naming conventions
- Maintain consistent indentation and formatting
- Apply the same architectural patterns throughout

## Naming Conventions

### Variables and Functions
```javascript
// Good
const userProfile = getUserProfile();
const isAuthenticated = checkAuthStatus();

// Avoid
const up = getUsrProf();
const auth = chkAuth();
```

### Constants
```javascript
// Good
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// Avoid
const maxRetryAttempts = 3;
const apiBaseUrl = 'https://api.example.com';
```

### Classes and Components
```javascript
// Good
class UserService { }
const UserProfile = () => { };

// Avoid
class userservice { }
const userProfile = () => { };
```

## Code Organization

### File Structure
- Group related functionality together
- Use descriptive file and folder names
- Keep files focused on specific concerns
- Limit file length (typically under 300 lines)

### Function Guidelines
- Keep functions small and focused
- Limit function parameters (typically under 5)
- Use pure functions when possible
- Handle errors appropriately

### Documentation
- Document complex business logic
- Use JSDoc or similar for public APIs
- Keep comments up-to-date with code changes
- Explain why, not what

## Best Practices

### Error Handling
```javascript
// Good
try {
  const result = await apiCall();
  return result;
} catch (error) {
  logger.error('API call failed:', error);
  throw new CustomError('Failed to fetch data');
}

// Avoid
const result = await apiCall(); // Silent failures
```

### Performance
- Avoid premature optimization
- Profile before optimizing
- Cache expensive operations
- Use appropriate data structures

### Security
- Validate all user inputs
- Use parameterized queries
- Implement proper authentication
- Follow principle of least privilege