# Testing React Applications

This file covers testing strategies and tools for React applications.

## Testing Tools

### Jest + React Testing Library (Recommended)
- Jest: Test runner and assertion library
- React Testing Library: Testing utilities focused on user behavior

### Setup
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## Component Testing

### Basic Component Test
```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Testing Hooks
```jsx
import { renderHook, act } from '@testing-library/react';
import useCounter from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

## Integration Testing

### Testing with Context
```jsx
import { render, screen } from '@testing-library/react';
import { AuthProvider } from './AuthContext';
import UserProfile from './UserProfile';

const renderWithAuth = (ui, { user = null } = {}) => {
  return render(
    <AuthProvider value={{ user }}>
      {ui}
    </AuthProvider>
  );
};

test('displays user name when logged in', () => {
  const user = { name: 'John Doe' };
  renderWithAuth(<UserProfile />, { user });
  
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

## Best Practices

- Test behavior, not implementation
- Use data-testid sparingly
- Test user interactions
- Mock external dependencies
- Test error states
- Maintain good test coverage
- Write descriptive test names