# TodoApp Project

This file documents the TodoApp project, a full-stack application demonstrating modern web development practices.

## Project Overview

TodoApp is a comprehensive task management application built to showcase best practices in full-stack development. It features a React frontend, Python FastAPI backend, and PostgreSQL database with real-time updates and user authentication.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **UI Framework**: Material-UI (MUI)
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

### Backend (Python FastAPI)
- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy
- **Authentication**: JWT with OAuth2
- **Real-time**: WebSocket support
- **Testing**: pytest with test coverage

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Database**: PostgreSQL 14+
- **Caching**: Redis for sessions

## Project Structure

```
todoapp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoList/
│   │   │   ├── TodoItem/
│   │   │   └── Layout/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── todos/
│   │   │   └── users/
│   │   ├── store/
│   │   │   ├── api/
│   │   │   └── slices/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       └── deps.py
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── tests/
│   ├── requirements.txt
│   └── main.py
├── docker-compose.yml
└── README.md
```

## Key Features

### User Authentication
- User registration and login
- JWT token-based authentication
- Password hashing and security
- Protected routes and API endpoints

### Todo Management
```typescript
// Frontend Todo interface
interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// API service with RTK Query
export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/todos',
    prepareHeaders: (headers, { getState }) => {
      const token = selectCurrentToken(getState());
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => '',
      providesTags: ['Todo'],
    }),
    createTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (todo) => ({
        url: '',
        method: 'POST',
        body: todo,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodo: builder.mutation<Todo, { id: string; updates: Partial<Todo> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});
```

### Backend API Endpoints
```python
# Todo model
class Todo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: bool = False
    priority: Priority = Priority.MEDIUM
    due_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: str

# API endpoints
@router.get("/", response_model=List[TodoResponse])
async def get_todos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    todos = db.query(Todo).filter(Todo.user_id == current_user.id).all()
    return todos

@router.post("/", response_model=TodoResponse, status_code=201)
async def create_todo(
    todo_data: TodoCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    todo = Todo(**todo_data.dict(), user_id=current_user.id)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo
```

### Real-time Updates
```python
# WebSocket endpoint for real-time updates
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            # Process real-time updates
            await websocket.send_text(f"Message: {data}")
    except WebSocketDisconnect:
        print(f"User {user_id} disconnected")
```

## Component Examples

### TodoList Component
```tsx
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useGetTodosQuery } from '../store/api/todoApi';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { data: todos, isLoading, error } = useGetTodosQuery();

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error loading todos</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Todos
      </Typography>
      {todos?.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </Box>
  );
};
```

### TodoItem Component
```tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Chip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useUpdateTodoMutation, useDeleteTodoMutation } from '../store/api/todoApi';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleToggleComplete = () => {
    updateTodo({
      id: todo.id,
      updates: { completed: !todo.completed }
    });
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Checkbox
              checked={todo.completed}
              onChange={handleToggleComplete}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  opacity: todo.completed ? 0.6 : 1,
                }}
              >
                {todo.title}
              </Typography>
              {todo.description && (
                <Typography variant="body2" color="text.secondary">
                  {todo.description}
                </Typography>
              )}
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={todo.priority}
              color={getPriorityColor(todo.priority)}
              size="small"
            />
            <IconButton onClick={handleDelete} color="error">
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
```

## Testing

### Frontend Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { TodoItem } from './TodoItem';

const mockTodo = {
  id: '1',
  title: 'Test Todo',
  completed: false,
  priority: 'medium' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'user1',
};

test('renders todo item correctly', () => {
  render(
    <Provider store={store}>
      <TodoItem todo={mockTodo} />
    </Provider>
  );

  expect(screen.getByText('Test Todo')).toBeInTheDocument();
  expect(screen.getByRole('checkbox')).not.toBeChecked();
});

test('toggles todo completion', () => {
  render(
    <Provider store={store}>
      <TodoItem todo={mockTodo} />
    </Provider>
  );

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  // Assert that update mutation was called
  // (requires mocking the RTK Query hooks)
});
```

### Backend Tests
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_todo(test_user_token):
    response = client.post(
        "/api/v1/todos/",
        json={
            "title": "Test Todo",
            "description": "Test description",
            "priority": "medium"
        },
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["completed"] == False

def test_get_todos(test_user_token, test_todo):
    response = client.get(
        "/api/v1/todos/",
        headers={"Authorization": f"Bearer {test_user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == test_todo.title
```

## Deployment

### Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/todoapp
      - JWT_SECRET=your-secret-key
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=todoapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## Learning Outcomes

This project demonstrates:
- Full-stack application architecture
- Modern React development with TypeScript
- FastAPI backend development
- Database design and relationships
- Authentication and authorization
- Real-time features with WebSockets
- Testing strategies for both frontend and backend
- Containerization and deployment
- CI/CD pipeline implementation