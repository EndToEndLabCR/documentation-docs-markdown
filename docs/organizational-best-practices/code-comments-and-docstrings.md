# Code Comments and Docstrings

This file provides guidelines for writing effective comments and documentation in code.

## When to Comment

### Good Reasons to Comment

- Complex business logic
- Non-obvious algorithms
- API documentation
- Configuration explanations
- Temporary workarounds (with TODO/FIXME)

### Avoid Commenting

- Obvious code behavior
- Redundant information
- Out-of-date information
- Bad code (refactor instead)

## Comment Types

### Inline Comments

```python
# Good: Explains why
user_score = base_score * 1.15  # Apply 15% bonus for premium users

# Avoid: States the obvious
user_score = base_score * 1.15  # Multiply base_score by 1.15
```

### Block Comments

```python
"""
Calculate the optimal batch size for processing items.

Uses a heuristic based on available memory and item complexity.
Larger batches improve throughput but may cause memory issues.
"""
def calculate_batch_size(items, available_memory):
    # Implementation here
    pass
```

## Docstring Standards

### Python (Google Style)

```python
def fetch_user_data(user_id: int, include_permissions: bool = False) -> dict:
    """Fetches user data from the database.

    Args:
        user_id: The unique identifier for the user.
        include_permissions: Whether to include user permissions in the result.

    Returns:
        A dictionary containing user information with the following keys:
        - id: User ID
        - name: User's full name
        - email: User's email address
        - permissions: List of permissions (if include_permissions is True)

    Raises:
        UserNotFoundError: If the user with the given ID doesn't exist.
        DatabaseError: If there's an issue with the database connection.

    Example:
        >>> user = fetch_user_data(123, include_permissions=True)
        >>> print(user['name'])
        'John Doe'
    """
    pass
```

### JavaScript (JSDoc)

```javascript
/**
 * Calculates the total price including tax and discounts.
 *
 * @param {number} basePrice - The base price before tax and discounts
 * @param {number} taxRate - The tax rate as a decimal (e.g., 0.08 for 8%)
 * @param {number} [discountPercent=0] - The discount percentage (0-100)
 * @returns {number} The final price after tax and discounts
 *
 * @example
 * // Calculate price with 8% tax and 10% discount
 * const total = calculateTotal(100, 0.08, 10);
 * console.log(total); // 97.2
 */
function calculateTotal(basePrice, taxRate, discountPercent = 0) {
  // Implementation here
}
```

## API Documentation

### REST API Endpoints

```python
@app.post("/users")
async def create_user(user_data: UserCreate) -> UserResponse:
    """Create a new user account.

    Creates a new user with the provided information. The email address
    must be unique across all users.

    Args:
        user_data: User creation data including name, email, and password

    Returns:
        UserResponse: Created user information (excluding password)

    Raises:
        HTTPException 400: If email already exists or validation fails
        HTTPException 500: If there's a server error during creation
    """
    pass
```

## TODO and FIXME Comments

```python
# TODO: Implement caching for better performance
# FIXME: This method has a memory leak with large datasets
# HACK: Temporary workaround for API limitation
# NOTE: This behavior is required by legacy system
```

## Documentation Maintenance

- Review comments during code reviews
- Update documentation when code changes
- Remove outdated comments
- Use automated tools to check documentation coverage
- Link to external documentation when appropriate
