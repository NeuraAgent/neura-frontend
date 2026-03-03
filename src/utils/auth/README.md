# Authentication Utils

Comprehensive token expiry handling system following SOLID principles.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Token Expiry System                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Storage    │    │   Cookies    │    │  Navigation  │  │
│  │   Manager    │    │   Manager    │    │   Manager    │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         └────────────────────┴────────────────────┘          │
│                              │                                │
│                    ┌─────────▼─────────┐                     │
│                    │     Session       │                     │
│                    │     Manager       │                     │
│                    └─────────┬─────────┘                     │
│                              │                                │
│                    ┌─────────▼─────────┐                     │
│                    │  Token Expiry     │                     │
│                    │     Handler       │                     │
│                    └─────────┬─────────┘                     │
│                              │                                │
│                    ┌─────────▼─────────┐                     │
│                    │      Axios        │                     │
│                    │   Interceptor     │                     │
│                    └───────────────────┘                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## SOLID Principles Applied

### Single Responsibility Principle (SRP)

Each class has ONE responsibility:

- `StorageManager` - localStorage/sessionStorage operations
- `CookieManager` - Cookie operations
- `NavigationManager` - Navigation operations
- `SessionManager` - Session cleanup
- `TokenExpiryHandler` - Token expiry orchestration
- `AxiosInterceptor` - HTTP interceptor setup

### Open/Closed Principle (OCP)

Easy to extend without modifying existing code:

```typescript
// Add new storage type without changing StorageManager
class SecureStorageManager extends StorageManager {
  static setEncryptedItem(key: string, value: string) {
    const encrypted = encrypt(value);
    super.setItem(key, encrypted);
  }
}
```

### Liskov Substitution Principle (LSP)

Managers can be replaced with enhanced versions:

```typescript
// Can replace CookieManager with SecureCookieManager
class SecureCookieManager extends CookieManager {
  static setCookie(name: string, value: string, days?: number) {
    super.setCookie(name, encrypt(value), days);
  }
}
```

### Interface Segregation Principle (ISP)

Each manager exposes only what's needed:

```typescript
// StorageManager doesn't expose cookie methods
// CookieManager doesn't expose storage methods
```

### Dependency Inversion Principle (DIP)

High-level modules depend on abstractions:

```typescript
// TokenExpiryHandler depends on abstractions (managers)
// Not on concrete implementations
TokenExpiryHandler.handleTokenExpiry(); // Uses SessionManager
SessionManager.clearSession(); // Uses StorageManager + CookieManager
```

## Quick Start

### 1. Initialize in App Entry Point

```typescript
// src/main.tsx or src/App.tsx
import { setupAuth } from '@/utils/auth/setupAuth';

// Initialize once
setupAuth();

// Your app code...
```

### 2. Use in Components

```typescript
import { useTokenExpiry } from '@/hooks/useTokenExpiry';

function MyComponent() {
  const { handle401, logout, hasActiveSession } = useTokenExpiry();

  // Check session
  if (!hasActiveSession()) {
    // Handle no session
  }

  // Manual logout
  const handleLogout = () => {
    logout();
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### 3. Use in Services

```typescript
import { TokenExpiryHandler } from '@/utils/auth';

// In your API service
try {
  const response = await api.get('/protected-route');
} catch (error) {
  if (error.response?.status === 401) {
    TokenExpiryHandler.handle401Error();
  }
}
```

## API Reference

### TokenExpiryHandler

Main handler for token expiration.

```typescript
// Handle token expiry
TokenExpiryHandler.handleTokenExpiry({
  clearSession: true,
  showNotification: true,
  returnUrl: '/dashboard',
  message: 'Session expired',
});

// Handle 401 error
TokenExpiryHandler.handle401Error();

// Handle 403 error
TokenExpiryHandler.handle403Error();

// Manual logout
TokenExpiryHandler.logout();
```

### SessionManager

Manages session cleanup.

```typescript
// Clear all session data
SessionManager.clearSession();

// Clear only auth data
SessionManager.clearAuthData();

// Check active session
const isActive = SessionManager.hasActiveSession();

// Logout
SessionManager.logout();
```

### StorageManager

Manages localStorage operations.

```typescript
// Clear auth storage
StorageManager.clearAuthStorage();

// Clear all storage
StorageManager.clearAllStorage();

// Get/Set items
const token = StorageManager.getItem('accessToken');
StorageManager.setItem('accessToken', 'new-token');

// Check token
const hasToken = StorageManager.hasValidToken();
```

### CookieManager

Manages cookie operations.

```typescript
// Clear auth cookies
CookieManager.clearAuthCookies();

// Clear all cookies
CookieManager.clearAllCookies();

// Get/Set cookies
const token = CookieManager.getCookie('access_token');
CookieManager.setCookie('access_token', 'token', 7); // 7 days

// Check cookies
const hasCookies = CookieManager.hasAuthCookies();
```

### NavigationManager

Manages navigation.

```typescript
// Navigate to login
NavigationManager.navigateToLogin('/dashboard');

// Check current page
const isLogin = NavigationManager.isLoginPage();
const isPublic = NavigationManager.isPublicRoute();

// Get current path
const path = NavigationManager.getCurrentPath();
```

## Usage Examples

### Example 1: Axios Interceptor (Automatic)

```typescript
// Automatically handles 401/403 errors
import axios from 'axios';
import { setupAuth } from '@/utils/auth/setupAuth';

// Setup once
setupAuth();

// All axios requests now have interceptors
axios
  .get('/api/protected')
  .then(response => console.log(response))
  .catch(error => {
    // 401 errors automatically handled
    // User redirected to login
    // Session cleared
  });
```

### Example 2: Manual Handling

```typescript
import { TokenExpiryHandler } from '@/utils/auth';

async function fetchData() {
  try {
    const response = await fetch('/api/data');

    if (response.status === 401) {
      TokenExpiryHandler.handle401Error();
      return;
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
```

### Example 3: React Component

```typescript
import { useTokenExpiry } from '@/hooks/useTokenExpiry';
import { useEffect } from 'react';

function Dashboard() {
  const { hasActiveSession, handleExpiry } = useTokenExpiry();

  useEffect(() => {
    if (!hasActiveSession()) {
      handleExpiry('Please login to continue');
    }
  }, [hasActiveSession, handleExpiry]);

  return <div>Dashboard Content</div>;
}
```

### Example 4: Protected Route

```typescript
import { Navigate } from 'react-router-dom';
import { SessionManager } from '@/utils/auth';

function ProtectedRoute({ children }) {
  if (!SessionManager.hasActiveSession()) {
    return <Navigate to="/neura/login" replace />;
  }

  return children;
}
```

### Example 5: Custom Error Handler

```typescript
import { TokenExpiryHandler } from '@/utils/auth';

window.addEventListener('error', event => {
  if (event.message.includes('401') || event.message.includes('Unauthorized')) {
    TokenExpiryHandler.handle401Error();
  }
});
```

## Configuration

### Customize Routes

```typescript
// src/utils/auth/constants.ts
export const AUTH_ROUTES = {
  LOGIN: '/custom/login',
  LOGOUT: '/custom/logout',
  SIGNUP: '/custom/signup',
} as const;
```

### Customize Storage Keys

```typescript
// src/utils/auth/constants.ts
export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'myapp_token',
  REFRESH_TOKEN: 'myapp_refresh',
  USER_DATA: 'myapp_user',
} as const;
```

### Customize Cookie Names

```typescript
// src/utils/auth/constants.ts
export const AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: 'myapp_access',
  REFRESH_TOKEN: 'myapp_refresh',
} as const;
```

## Testing

### Unit Tests

```typescript
import { StorageManager } from '@/utils/auth';

describe('StorageManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should clear auth storage', () => {
    StorageManager.setItem('accessToken', 'token');
    StorageManager.clearAuthStorage();
    expect(StorageManager.getItem('accessToken')).toBeNull();
  });
});
```

### Integration Tests

```typescript
import { TokenExpiryHandler } from '@/utils/auth';

describe('TokenExpiryHandler', () => {
  it('should handle 401 error', () => {
    const spy = jest.spyOn(window.location, 'href', 'set');
    TokenExpiryHandler.handle401Error();
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('/login'));
  });
});
```

## Troubleshooting

### Issue: Interceptor not working

**Solution**: Ensure `setupAuth()` is called before any axios requests

### Issue: Cookies not clearing

**Solution**: Check cookie domain and path settings

### Issue: Infinite redirect loop

**Solution**: Ensure login page is in `isPublicRoute()` check

### Issue: Token still in storage after logout

**Solution**: Call `SessionManager.clearSession()` instead of individual clears

## Best Practices

1. ✅ Call `setupAuth()` once in app entry point
2. ✅ Use `useTokenExpiry` hook in React components
3. ✅ Let interceptors handle 401/403 automatically
4. ✅ Use `SessionManager.clearSession()` for complete cleanup
5. ✅ Check `hasActiveSession()` before protected operations
6. ❌ Don't call `TokenExpiryHandler` multiple times simultaneously
7. ❌ Don't mix manual and automatic handling
8. ❌ Don't forget to add public routes to `isPublicRoute()`

## Migration Guide

### From Old System

```typescript
// Old way
localStorage.clear();
document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
window.location.href = '/login';

// New way
import { TokenExpiryHandler } from '@/utils/auth';
TokenExpiryHandler.logout();
```

## Performance

- ✅ Lazy loading of toast service
- ✅ Single interceptor setup
- ✅ Debounced expiry handling
- ✅ Minimal re-renders in React hooks

## Security

- ✅ Clears all auth data on expiry
- ✅ Handles both cookies and localStorage
- ✅ Prevents multiple simultaneous logouts
- ✅ Validates session before operations

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-03  
**Maintainer**: Development Team
