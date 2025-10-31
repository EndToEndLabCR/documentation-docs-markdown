# JavaScript and TypeScript

This file covers JavaScript and TypeScript fundamentals for frontend development.

## Modern JavaScript (ES6+)

### Arrow Functions

```javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With multiple statements
const processData = (data) => {
  const cleaned = data.filter((item) => item.valid);
  return cleaned.map((item) => item.value);
};
```

### Destructuring

```javascript
// Object destructuring
const user = { name: "John", age: 30, email: "john@example.com" };
const { name, age } = user;

// Array destructuring
const colors = ["red", "green", "blue"];
const [primary, secondary] = colors;

// Function parameters
const greet = ({ name, age }) => `Hello ${name}, you are ${age}`;
```

### Template Literals

```javascript
const name = "World";
const greeting = `Hello, ${name}!`;

// Multi-line strings
const html = `
  <div>
    <h1>${title}</h1>
    <p>${description}</p>
  </div>
`;
```

## TypeScript Advantages

### Type Safety

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive?: boolean;
}

const createUser = (userData: Omit<User, "id">): User => {
  return {
    id: Math.random(),
    ...userData,
    isActive: userData.isActive ?? true,
  };
};
```

### Generic Types

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const fetchUser = async (id: number): Promise<ApiResponse<User>> => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};
```

## Best Practices

### JavaScript

- Use const by default, let when reassignment needed
- Prefer template literals over string concatenation
- Use async/await over Promises when possible
- Implement proper error handling

### TypeScript

- Enable strict mode in tsconfig.json
- Use interfaces for object shapes
- Leverage union types for flexibility
- Use proper type guards for runtime checks
