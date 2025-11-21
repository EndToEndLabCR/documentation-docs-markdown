# React Component Structure

This file explains how to structure React components effectively for maintainability and scalability.

## Component Organization

### Functional Components (Recommended)

```jsx
import React from "react";

const UserProfile = ({ user, onEdit }) => {
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>Edit Profile</button>
    </div>
  );
};

export default UserProfile;
```

### Component File Structure

```
components/
  UserProfile/
    index.js
    UserProfile.jsx
    UserProfile.test.js
    UserProfile.module.css
```

## Design Patterns

### Container vs Presentational Components

- **Container**: Handle logic and state
- **Presentational**: Focus on UI rendering

### Composition over Inheritance

- Use props.children for flexibility
- Create reusable wrapper components

### Custom Hooks

- Extract component logic into reusable hooks
- Share stateful logic between components

## Props Best Practices

- Use PropTypes or TypeScript for type checking
- Provide default props when appropriate
- Keep props interface simple and focused
- Use destructuring for cleaner code

## Component Lifecycle

### With Hooks

```jsx
import React, { useState, useEffect } from "react";

const DataComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return data ? <div>{data.title}</div> : <div>Loading...</div>;
};
```

## Performance Optimization

- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid creating objects in render
- Use useMemo and useCallback when needed
