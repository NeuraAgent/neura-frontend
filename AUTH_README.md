# Authentication Implementation

This document describes the authentication system implemented in the frontend service.

## Overview

The authentication system provides secure login, logout, and forgot password functionality for the Agent Education Chat application. It uses JWT tokens for authentication and integrates with the backend auth API.

## Features

- **Login**: Email/password authentication with JWT token storage
- **Logout**: Secure logout with token cleanup
- **Forgot Password**: Password reset functionality via email
- **Protected Routes**: Automatic redirection for unauthenticated users
- **User Context**: Global authentication state management
- **Auto Token Refresh**: Automatic token refresh when possible

## Architecture

### Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Provides global authentication state
   - Manages user data and tokens
   - Handles login/logout operations

2. **AuthService** (`src/services/authService.ts`)
   - API communication layer
   - Token management
   - HTTP interceptors for automatic token handling

3. **Authentication Components**
   - `Login.tsx`: Login form with validation
   - `ForgotPassword.tsx`: Password reset form
   - `ProtectedRoute.tsx`: Route protection wrapper

4. **Routing** (`src/components/AppRoutes.tsx`)
   - Route configuration
   - Protected route implementation
   - Automatic redirects

### Authentication Flow

1. **Login Process**:
   - User enters credentials
   - AuthService calls `/api/auth/login`
   - On success, stores JWT token and user data
   - Redirects to intended destination

2. **Protected Access**:
   - ProtectedRoute checks authentication status
   - Redirects to login if not authenticated
   - Preserves intended destination for post-login redirect

3. **Logout Process**:
   - Calls `/api/auth/logout` endpoint
   - Clears local storage
   - Closes WebSocket connections
   - Redirects to login page

## Configuration

### Environment Variables

The following environment variables are configured in `.env`:

```env
# Authentication API Configuration
VITE_AUTH_API_URL=http://localhost:9999

# WebSocket Configuration
VITE_WEBSOCKET_URL=ws://localhost:8003

# Application Configuration
VITE_APP_NAME=Agent Education Chat
VITE_APP_VERSION=1.0.0
```

### API Endpoints Expected

The frontend expects the following API endpoints to be available:

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/refresh` - Token refresh (optional)

## Usage

### Using Authentication Context

```tsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Component logic here
};
```

### Protecting Routes

```tsx
import ProtectedRoute from './auth/ProtectedRoute';

<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <MyProtectedComponent />
    </ProtectedRoute>
  }
/>;
```

## Security Features

1. **Token Storage**: JWT tokens stored in localStorage
2. **HTTP Interceptors**: Automatic token attachment to requests
3. **Token Expiry Handling**: Automatic logout on token expiry
4. **CSRF Protection**: Ready for CSRF token implementation
5. **Secure Logout**: Server-side token invalidation

## Integration with Chat Interface

The chat interface now includes:

- User profile display in header
- Logout functionality
- User menu with profile information
- Automatic WebSocket cleanup on logout

## Development Notes

- All authentication components use Tailwind CSS for styling
- TypeScript interfaces ensure type safety
- Error handling provides user-friendly messages
- Loading states improve user experience
- Responsive design works on mobile and desktop

## Next Steps

To complete the authentication system:

1. **Backend Implementation**: Create the auth API endpoints
2. **User Registration**: Add signup functionality
3. **Profile Management**: Add user profile editing
4. **Password Reset**: Complete the password reset flow
5. **Session Management**: Add session timeout handling
6. **Security Enhancements**: Add rate limiting and CSRF protection
