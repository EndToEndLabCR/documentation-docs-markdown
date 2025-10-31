# Postman

This file covers using Postman for API development, testing, and documentation.

## What is Postman?

Postman is a popular API development platform that simplifies the process of building, testing, and documenting APIs.

## Key Features

- **Request Builder**: Create and send HTTP requests
- **Collections**: Organize related requests
- **Environment Variables**: Manage different environments
- **Testing**: Write automated tests for APIs
- **Documentation**: Generate API documentation
- **Monitoring**: Schedule API tests

## Getting Started

### Making a Request

1. Select HTTP method (GET, POST, PUT, DELETE)
2. Enter request URL
3. Add headers if needed
4. Add request body for POST/PUT
5. Send request and view response

### Example Request

```
Method: POST
URL: https://api.example.com/users
Headers:
  Content-Type: application/json
  Authorization: Bearer your-token

Body:
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Collections and Environments

### Creating Collections

- Group related API requests
- Add folders for organization
- Share with team members
- Export/import for backup

### Environment Variables

```json
{
  "base_url": "https://api.staging.example.com",
  "api_key": "your-api-key",
  "user_id": "12345"
}
```

## Testing with Postman

### Basic Tests

```javascript
// Status code test
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

// Response time test
pm.test("Response time is less than 200ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(200);
});

// Response body test
pm.test("Response has user data", function () {
  const responseJson = pm.response.json();
  pm.expect(responseJson).to.have.property("name");
  pm.expect(responseJson.name).to.eql("John Doe");
});
```

## Best Practices

- Use meaningful request names
- Organize requests in logical collections
- Use environment variables for different stages
- Write comprehensive tests
- Document your APIs
- Share collections with team
- Use pre-request scripts for authentication
