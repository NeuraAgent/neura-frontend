# Enterprise Authentication System

## Overview

The Enterprise Authentication system is a **separate, decoupled authentication service** for the enterprise application. It is completely independent from the main Neura application authentication (`/neura/*` routes).

**Key Principle**: Enterprise auth is designed as a separate service that can be replaced with a real backend later.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 ENTERPRISE APPLICATION                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              AUTHENTICATION LAYER                     │  │
│  │  ┌────────────────┐  ┌────────────────┐             │  │
│  │  │ EnterpriseAuth │  │   authService  │             │  │
│  │  │    Context     │  │  (Mock API)    │             │  │
│  │  └────────────────┘  └────────────────┘             │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              ACCESS CONTROL LAYER (ABAC)              │  │
│  │  ┌────────────────┐  ┌────────────────┐             │  │
│  │  │  ABACContext   │  │   ABAC Engine  │             │  │
│  │  │  (useABAC)     │  │  (Policies)    │             │  │
│  │  └────────────────┘  └────────────────┘             │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PROTECTED ROUTES                         │  │
│  │  ┌────────────────┐  ┌────────────────┐             │  │
│  │  │  /enterprise   │  │ /enterprise/*  │             │  │
│  │  │    /login      │  │  (Protected)   │             │  │
│  │  └────────────────┘  └────────────────┘             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
src/features/
├── auth/                           # Enterprise Authentication
│   ├── authService.ts              # Mock API service (JWT-like)
│   ├── EnterpriseAuthContext.tsx   # Auth context & provider
│   ├── EnterpriseProtectedRoute.tsx # Route guard
│   ├── types.ts                    # TypeScript types
│   └── index.ts                    # Public exports
│
├── abac/                           # Attribute-Based Access Control
│   ├── ABACContext.tsx             # ABAC context (integrated with auth)
│   ├── engine.ts                   # Access evaluation engine
│   ├── types.ts                    # ABAC types
│   └── index.ts                    # Public exports
│
└── README.md                       # Feature documentation
```

---

## Components

### 1. Enterprise Auth Service (`authService.ts`)

Mock API service simulating external authentication backend.

**Methods**:
- `login(email, password)` - Authenticate user, return JWT token
- `getCurrentUser(token)` - Validate token, return user data
- `logout(token)` - Invalidate session
- `restoreSession()` - Restore session from localStorage

**Mock Users**:
| Email | Password | Role | Department |
|-------|----------|------|------------|
| admin@enterprise.com | admin123 | admin | IT |
| manager@enterprise.com | manager123 | manager | Operations |
| analyst@enterprise.com | analyst123 | analyst | Analytics |
| viewer@enterprise.com | viewer123 | viewer | General |

**Token Storage**: `localStorage.enterprise_access_token`

---

### 2. Enterprise Auth Context (`EnterpriseAuthContext.tsx`)

React Context for managing enterprise authentication state.

**State**:
```typescript
interface EnterpriseAuthState {
  user: EnterpriseUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Methods**:
```typescript
interface EnterpriseAuthContextValue extends EnterpriseAuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
```

**Usage**:
```typescript
import { useEnterpriseAuth } from '@/features/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useEnterpriseAuth();
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <div>Welcome, {user.name}</div>;
}
```

---

### 3. Enterprise Protected Route (`EnterpriseProtectedRoute.tsx`)

Route guard component for protecting enterprise routes.

**Features**:
- Redirects to `/enterprise/login` if not authenticated
- Shows loading spinner during auth check
- Optional `requiredPermissions` prop for ABAC integration

**Usage**:
```typescript
import { EnterpriseProtectedRoute } from '@/features/auth';

<Route 
  path="/enterprise/admin" 
  element={
    <EnterpriseProtectedRoute requiredPermissions={['manage_users']}>
      <AdminPanel />
    </EnterpriseProtectedRoute>
  } 
/>
```

---

### 4. ABAC Context (`ABACContext.tsx`)

Attribute-Based Access Control integrated with Enterprise Auth.

**Integration**: ABAC automatically syncs with authenticated user from `useEnterpriseAuth()`.

**Hook API**:
```typescript
const { 
  currentUser,       // Current ABAC user
  accessLogs,        // Access attempt logs
  checkAccess,       // Check document access
  getAccessibleDocuments, // Filter accessible docs
  switchUser,        // Switch user (demo only)
  clearLogs          // Clear access logs
} = useABAC();
```

**Access Evaluation**:
```typescript
// Check if user can access a document
const canAccess = checkAccess(documentId, 'read');

// Get all accessible documents
const docs = getAccessibleDocuments();
```

---

## Authentication Flow

```
1. User visits /enterprise/*
   ↓
2. EnterpriseProtectedRoute checks isAuthenticated
   ↓
3. If NOT authenticated → Redirect to /enterprise/login
   ↓
4. User submits login form
   ↓
5. authService.login(email, password)
   ↓
6. Mock API validates credentials
   ↓
7. Returns { accessToken, user }
   ↓
8. Token stored in localStorage
   ↓
9. User stored in EnterpriseAuthContext
   ↓
10. ABAC Context syncs with authenticated user
   ↓
11. Redirect to /enterprise/dashboard
```

---

## ABAC Integration

When a user logs in:

1. `EnterpriseAuthContext` stores the authenticated user
2. `ABACContext` listens for auth changes via `useEnterpriseAuth()`
3. `useEffect` syncs the ABAC `currentUser` with authenticated user
4. All ABAC checks now use the real authenticated user

**Code Flow**:
```typescript
// ABACContext.tsx
const { user: authenticatedUser, isAuthenticated } = useEnterpriseAuth();

useEffect(() => {
  if (isAuthenticated && authenticatedUser) {
    setCurrentUser(authenticatedUser);
  }
}, [isAuthenticated, authenticatedUser]);
```

---

## Routes

| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/enterprise/login` | EnterpriseLoginPage | No | Login page |
| `/enterprise` | EnterpriseDashboard | Yes | Main dashboard |
| `/enterprise/documents` | DocumentsPage | Yes | Document management |
| `/enterprise/analytics` | AnalyticsPage | Yes | Analytics dashboard |
| `/enterprise/settings` | SettingsPage | Yes | Settings page |
| `/enterprise/admin` | AdminPage | Yes + Admin Role | Admin panel |

---

## Security Considerations

### Current (Mock Implementation)
- JWT-like tokens (simulated)
- Token stored in localStorage
- Basic role-based access

### Future Backend Integration
- Replace `authService.ts` with real API calls
- Implement refresh token rotation
- Add CSRF protection
- Integrate with SSO/SAML if needed
- Move sensitive operations to backend

---

## TypeScript Types

```typescript
// User Types
interface EnterpriseUser {
  id: string;
  email: string;
  name: string;
  role: EnterpriseRole;
  department: string;
  permissions: string[];
  clearanceLevel: number;
  attributes: Record<string, unknown>;
}

type EnterpriseRole = 'admin' | 'manager' | 'analyst' | 'viewer';

// Auth Types
interface EnterpriseLoginRequest {
  email: string;
  password: string;
}

interface EnterpriseLoginResponse {
  success: boolean;
  accessToken?: string;
  user?: EnterpriseUser;
  error?: string;
}
```

---

## Testing

### Manual Testing
1. Navigate to `/enterprise/login`
2. Use mock credentials (see table above)
3. Verify redirect to dashboard
4. Check ABAC permissions in dashboard
5. Test logout functionality
6. Test session restoration on page refresh

### Test Scenarios
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected route without auth
- [ ] Session persistence across refresh
- [ ] Logout clears session
- [ ] ABAC reflects correct user permissions

---

## Future Enhancements

- [ ] Token expiration and refresh
- [ ] Remember me functionality
- [ ] Multi-factor authentication
- [ ] SSO integration
- [ ] Audit logging
- [ ] Rate limiting on login attempts
- [ ] Password reset flow

---

**Last Updated**: 2025-03-30  
**Version**: 1.0  
**Phase**: 6 - Authentication (Decoupled Service)
