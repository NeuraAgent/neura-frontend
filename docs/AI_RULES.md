# AI Rules - Neura Frontend

AI agents MUST follow these rules when working with neura-frontend codebase.

---

## 1. Global Rules (MUST FOLLOW)

### TypeScript

- ALWAYS use TypeScript strict mode
- ALWAYS define types for props, state, and function parameters
- NEVER use `any` type (use `unknown` if type is truly unknown)
- ALWAYS use interfaces for object shapes
- ALWAYS use type aliases for unions and complex types
- ALWAYS export types from `@/types/index.ts`

### React Components

- ALWAYS use functional components with hooks
- NEVER use class components
- ALWAYS use TypeScript for component props
- ALWAYS destructure props in function signature
- ALWAYS use React.FC or explicit return type
- ALWAYS memoize expensive computations with `useMemo`
- ALWAYS memoize callbacks with `useCallback`
- ALWAYS use `React.memo` for pure components

### State Management

- USE React Context for global state (auth, locale)
- USE Zustand for complex client state (user store, tour store)
- USE useState for local component state
- NEVER prop drill more than 2 levels (use Context instead)
- ALWAYS keep state as close to usage as possible
- NEVER mutate state directly (use immutable updates)

### API Calls

- ALWAYS use service layer (`@/services/*`)
- NEVER make API calls directly in components
- ALWAYS handle loading states
- ALWAYS handle error states
- ALWAYS show user-friendly error messages
- ALWAYS use axios interceptors for auth headers
- ALWAYS cancel requests on component unmount

### Styling

- ALWAYS use Tailwind CSS utility classes
- NEVER write custom CSS unless absolutely necessary
- ALWAYS use responsive design (mobile-first)
- ALWAYS use Tailwind's design tokens (colors, spacing, etc.)
- NEVER use inline styles (except for dynamic values)
- ALWAYS use consistent spacing (4, 8, 16, 24, 32, 48, 64)

### Forms

- ALWAYS validate input on client side
- ALWAYS use Zod for validation schemas
- ALWAYS show validation errors inline
- ALWAYS disable submit button during submission
- ALWAYS show loading state on submit button
- ALWAYS clear form after successful submission
- NEVER trust client-side validation alone

### Security

- NEVER store sensitive data in localStorage (except JWT token)
- ALWAYS sanitize user input before rendering
- NEVER use dangerouslySetInnerHTML
- ALWAYS validate file uploads (type, size)
- ALWAYS use HTTPS in production
- NEVER log sensitive data (passwords, tokens)
- ALWAYS implement CSRF protection for state-changing operations

---

## 2. Architecture Rules

### Component Structure

```
Component/
├── Component.tsx           # Main component
├── Component.types.ts      # TypeScript types (if complex)
└── Component.test.tsx      # Tests (future)
```

### File Organization

```
src/
├── components/             # Reusable UI components
│   ├── auth/              # Auth-related components
│   ├── landing/           # Landing page components
│   └── error/             # Error handling components
├── pages/                 # Page-level components
├── contexts/              # React contexts
├── services/              # API service layer
├── stores/                # Zustand stores
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
├── utils/                 # Utility functions
├── constants/             # Constants and config
└── styles/                # Global styles
```

### Import Order

```typescript
// 1. React and external libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Internal components
import { Button } from '@/components/Button';

// 3. Contexts and stores
import { useAuth } from '@/contexts/AuthContext';

// 4. Services
import { authService } from '@/services/authService';

// 5. Types
import type { User } from '@/types';

// 6. Utils and constants
import { API_ENDPOINTS } from '@/constants/apiEndpoints';

// 7. Styles (if any)
import './Component.css';
```

### Path Aliases

ALWAYS use path aliases (configured in vite.config.ts):

```typescript
// ✅ GOOD
import { Button } from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

// ❌ BAD
import { Button } from '../../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
```

---

## 3. Code Style Rules

### Component Pattern

```typescript
import React from 'react';
import type { FC } from 'react';

interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export const Component: FC<ComponentProps> = ({
  title,
  onSubmit,
  isLoading = false
}) => {
  // 1. Hooks (useState, useEffect, useContext, custom hooks)
  const [value, setValue] = useState('');
  const { user } = useAuth();

  // 2. Derived state and memoized values
  const isValid = useMemo(() => value.length > 0, [value]);

  // 3. Event handlers
  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    onSubmit({ value });
  }, [value, isValid, onSubmit]);

  // 4. Effects
  useEffect(() => {
    // Side effects
    return () => {
      // Cleanup
    };
  }, []);

  // 5. Early returns
  if (!user) {
    return <div>Please login</div>;
  }

  // 6. Render
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border rounded px-4 py-2"
      />
      <button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </div>
  );
};
```

### Service Pattern

```typescript
// services/exampleService.ts
import axios from 'axios';
import { apiClient } from '@/utils/apiClient';
import type { ApiResponse, ExampleData } from '@/types';

class ExampleService {
  async getData(id: string): Promise<ApiResponse<ExampleData>> {
    try {
      const response = await apiClient.get(`/api/example/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  async createData(data: ExampleData): Promise<ApiResponse<ExampleData>> {
    try {
      const response = await apiClient.post('/api/example', data);
      return response.data;
    } catch (error) {
      console.error('Error creating data:', error);
      throw error;
    }
  }
}

export const exampleService = new ExampleService();
```

### Custom Hook Pattern

```typescript
// hooks/useExample.ts
import { useState, useEffect } from 'react';
import { exampleService } from '@/services/exampleService';
import type { ExampleData } from '@/types';

export const useExample = (id: string) => {
  const [data, setData] = useState<ExampleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await exampleService.getData(id);
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError('An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, isLoading, error };
};
```

---

## 4. Specific Rules

### Authentication

- ALWAYS check authentication before rendering protected routes
- ALWAYS redirect to login if not authenticated
- ALWAYS store JWT token in localStorage
- ALWAYS include token in Authorization header
- ALWAYS handle token expiration gracefully
- ALWAYS clear token on logout

### WebSocket

- ALWAYS use socketService for WebSocket connections
- ALWAYS handle connection/disconnection events
- ALWAYS clean up listeners on component unmount
- ALWAYS implement reconnection logic
- ALWAYS show connection status to user
- NEVER create multiple socket connections

### File Upload

- ALWAYS validate file type before upload
- ALWAYS validate file size (max 10MB)
- ALWAYS show upload progress
- ALWAYS handle upload errors
- ALWAYS clean up file readers on unmount
- NEVER upload files without user confirmation

### Error Handling

- ALWAYS show user-friendly error messages
- ALWAYS log errors to console (dev) or error tracking (prod)
- ALWAYS provide recovery actions (retry, go back)
- NEVER show technical error details to users
- ALWAYS use ErrorBoundary for component errors
- ALWAYS handle async errors with try-catch

### Performance

- ALWAYS lazy load routes with React.lazy
- ALWAYS use React.memo for expensive components
- ALWAYS debounce search inputs
- ALWAYS virtualize long lists (if >100 items)
- ALWAYS optimize images (WebP, lazy loading)
- NEVER render large lists without pagination

---

## 5. Testing Rules (Future)

### Unit Tests

- ALWAYS test component rendering
- ALWAYS test user interactions
- ALWAYS test error states
- ALWAYS mock API calls
- NEVER test implementation details
- ALWAYS use React Testing Library

### Integration Tests

- ALWAYS test complete user flows
- ALWAYS test API integration
- ALWAYS test authentication flow
- ALWAYS test error scenarios

---

## 6. DO NOT DO (Critical)

### Code

- ❌ DO NOT use `any` type
- ❌ DO NOT use class components
- ❌ DO NOT use inline styles (except dynamic values)
- ❌ DO NOT make API calls in components
- ❌ DO NOT mutate state directly
- ❌ DO NOT use `var` (use `const` or `let`)
- ❌ DO NOT ignore TypeScript errors
- ❌ DO NOT use `console.log` in production

### React

- ❌ DO NOT use index as key in lists
- ❌ DO NOT call hooks conditionally
- ❌ DO NOT call hooks in loops
- ❌ DO NOT forget to clean up effects
- ❌ DO NOT use dangerouslySetInnerHTML
- ❌ DO NOT prop drill more than 2 levels

### Security

- ❌ DO NOT store passwords in state
- ❌ DO NOT trust user input
- ❌ DO NOT skip input validation
- ❌ DO NOT expose API keys in code
- ❌ DO NOT log sensitive data
- ❌ DO NOT use eval() or Function()

### Performance

- ❌ DO NOT render large lists without pagination
- ❌ DO NOT create functions in render
- ❌ DO NOT use inline object/array literals in props
- ❌ DO NOT forget to memoize expensive computations
- ❌ DO NOT create multiple socket connections

---

## 7. Response Format

When user asks to add/modify frontend code, ALWAYS respond in this order:

1. **Analysis** (1-2 sentences)
   - What component/feature is affected?
   - What changes are needed?

2. **Proposed Solution** (bullet points)
   - Component structure
   - State management approach
   - API integration points
   - Styling approach

3. **Code Implementation**
   - Show complete component code
   - Include TypeScript types
   - Include proper error handling
   - Include loading states

4. **Testing Notes**
   - How to test manually
   - Edge cases to check
   - Browser compatibility notes

---

## 8. Common Patterns

### Loading State

```typescript
const [isLoading, setIsLoading] = useState(false);

// In component
{isLoading ? (
  <div className="flex justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
  </div>
) : (
  <Content />
)}
```

### Error State

```typescript
const [error, setError] = useState<string | null>(null);

// In component
{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}
```

### Form Validation

```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>;

const handleSubmit = (data: FormData) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    setErrors(result.error.flatten().fieldErrors);
    return;
  }
  // Submit valid data
};
```

### API Call with Loading/Error

```typescript
const [data, setData] = useState<Data | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await service.getData();
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);
```

---

## Summary

These rules ensure:

- ✅ Type safety with TypeScript
- ✅ Consistent code style
- ✅ Proper error handling
- ✅ Good performance
- ✅ Security best practices
- ✅ Maintainable code structure

**When in doubt**:

1. Check existing components for patterns
2. Follow TypeScript strict mode
3. Use Tailwind for styling
4. Keep components small and focused
5. Always handle loading and error states
