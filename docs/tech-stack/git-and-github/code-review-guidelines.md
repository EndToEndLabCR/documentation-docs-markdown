# Code Review Guidelines

This file establishes guidelines for effective code reviews that maintain code quality and foster team collaboration.

## Code Review Process

### Before Creating a PR

- [ ] Code builds successfully
- [ ] All tests pass
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated

### PR Creation

- Write clear title and description
- Link related issues
- Add appropriate labels
- Request specific reviewers
- Include screenshots for UI changes

## Review Checklist

### Functionality

- [ ] Code does what it's supposed to do
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] Performance considerations addressed

### Code Quality

- [ ] Code is readable and well-organized
- [ ] Functions/methods have single responsibility
- [ ] Naming conventions followed
- [ ] No duplicate code
- [ ] Comments explain complex logic

### Security

- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization checked
- [ ] SQL injection prevention

### Testing

- [ ] New code has appropriate tests
- [ ] Tests cover edge cases
- [ ] Mock/stub usage is appropriate
- [ ] Test names are descriptive

## Review Best Practices

### For Reviewers

- Be constructive and specific
- Ask questions to understand
- Suggest improvements, don't just criticize
- Acknowledge good practices
- Focus on code, not the person

### For Authors

- Respond to all feedback
- Ask for clarification when needed
- Be open to suggestions
- Make requested changes promptly
- Thank reviewers for their time

## Review Comments

### Good Examples

```
"Consider using a Map instead of nested loops for better performance"
"This function is getting large. Could we extract the validation logic?"
"Great use of the factory pattern here!"
```

### Avoid

```
"This is wrong"
"Bad code"
"Doesn't make sense"
```
