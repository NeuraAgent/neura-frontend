# Architecture - Neura Frontend

This document describes the architecture of the neura-frontend application.

---

## Overview

**Type**: Single Page Application (SPA)  
**Framework**: React 18 + TypeScript  
**Build Tool**: Vite  
**Styling**: Tailwind CSS  
**State**: React Context + Zustand  
**Routing**: React Router v7  
**Port**: 3000 (dev), 80 (production)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (User)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  React Application                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Presentation Layer                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │  Pages   │  │Components│  │  Layouts │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │           State Management Layer                    │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │ Context  │  │ Zustand  │  │  Local   │         │    │
│  │  │   API    │  │  Stores  │  │  State   │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Service Layer                             │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │
│  │  │   Auth   │  │ Payment  │  │  Socket  │         │    │
│  │  │ Service  │  │ Service  │  │ Service  │         │    │
│  │  └──────────┘  └──────────┘  └──────────┘         │    │
│  └────────────────────────────────────────────────────┘    │
│                         ↓                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Communication Layer                       │    │
│  │  ┌──────────┐  ┌──────────┐                        │    │
│  │  │   HTTP   │  │WebSocket │                        │    │
│  │  │  (Axios) │  │(Socket.IO)│                        │    │
│  │  └──────────┘  └──────────┘                        │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend Services                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │   API    │  │ AI Core  │  │ Payment  │                 │
│  │ Gateway  │  │(WebSocket)│  │ Service  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
neura-frontend/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── auth/               # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── landing/            # Landing page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   └── Footer.tsx
│   │   ├── error/              # Error handling
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── NotFound.tsx
│   │   ├── ChatInterface.tsx   # Main chat UI
│   │   ├── MessageList.tsx     # Chat messages
│   │   ├── MessageInput.tsx    # Chat input
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── SourcesManager.tsx  # Document management
│   │   └── ...
│   │
│   ├── pages/                  # Page-level components
│   │   └── Settings.tsx        # Settings page
│   │
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── LocaleContext.tsx   # i18n state
│   │
│   ├── services/               # API service layer
│   │   ├── authService.ts      # Auth API calls
│   │   ├── paymentService.ts   # Payment API calls
│   │   ├── socketService.ts    # WebSocket service
│   │   ├── vectordbService.ts  # VectorDB API calls
│   │   └── ...
│   │
│   ├── stores/                 # Zustand stores
│   │   ├── userStore.ts        # User state
│   │   └── introTourStore.ts   # Tour state
│   │
│   ├── hooks/                  # Custom hooks
│   │   └── useErrorHandler.ts
│   │
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/                  # Utility functions
│   │   ├── apiClient.ts        # Axios instance
│   │   ├── env.ts              # Environment validation
│   │   └── validation.ts       # Form validation
│   │
│   ├── constants/              # Constants
│   │   └── apiEndpoints.ts
│   │
│   ├── styles/                 # Global styles
│   │   └── index.css
│   │
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
│
├── public/                     # Static assets
├── docs/                       # Documentation
├── .env                        # Environment variables
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── LocaleProvider (Context)
│       └── BrowserRouter
│           ├── AppRoutes
│           │   ├── / (Landing Page)
│           │   │   ├── LandingNav
│           │   │   ├── HeroSection
│           │   │   ├── FeaturesSection
│           │   │   ├── PricingSection
│           │   │   └── Footer
│           │   │
│           │   ├── /login (Login Page)
│           │   │   └── LoginForm
│           │   │
│           │   ├── /signup (Signup Page)
│           │   │   └── SignupForm
│           │   │
│           │   ├── /dashboard (Protected)
│           │   │   └── Dashboard
│           │   │       ├── IntroTour
│           │   │       ├── Sidebar
│           │   │       │   ├── Logo
│           │   │       │   ├── SourcesManager
│           │   │       │   └── ClearButton
│           │   │       ├── ChatInterface
│           │   │       │   ├── FloatingCreditIndicator
│           │   │       │   ├── MessageList
│           │   │       │   └── MessageInput
│           │   │       └── ErrorBoundary
│           │   │
│           │   └── /settings (Protected)
│           │       └── Settings
│           │           ├── ProfileTab
│           │           ├── CreditsTab
│           │           └── PreferencesTab
│           │
│           └── ErrorBoundary
```

---

## State Management

### 1. React Context (Global State)

**AuthContext** - Authentication state

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<void>;
}
```

**LocaleContext** - Internationalization

```typescript
interface LocaleContextType {
  locale: 'vi' | 'en';
  setLocale: (locale: 'vi' | 'en') => void;
  t: (key: string) => string;
}
```

### 2. Zustand Stores (Client State)

**userStore** - User data and file management

```typescript
interface UserStore {
  user: User | null;
  fileIds: string[];
  setUser: (user: User) => void;
  addFileId: (fileId: string) => void;
  removeFileId: (fileId: string) => void;
}
```

**introTourStore** - Onboarding tour state

```typescript
interface IntroTourStore {
  isOpen: boolean;
  currentStep: number;
  hasCompletedTour: boolean;
  openTour: () => void;
  closeTour: () => void;
  nextStep: () => void;
  completeTour: () => void;
}
```

### 3. Local State (Component State)

Use `useState` for component-specific state:

- Form inputs
- UI toggles (modals, dropdowns)
- Loading states
- Error messages

---

## Data Flow

### Authentication Flow

```
1. User submits login form
   ↓
2. LoginForm → authService.login()
   ↓
3. authService → API Gateway → Auth Service
   ↓
4. Auth Service validates credentials
   ↓
5. Returns JWT token + user data
   ↓
6. AuthContext stores token (localStorage) + user (state)
   ↓
7. Redirect to /dashboard
```

### Chat Flow

```
1. User types message in MessageInput
   ↓
2. Check credits: paymentService.getCreditBalance()
   ↓
3. If sufficient credits:
   ↓
4. Connect WebSocket: socketService.connect()
   ↓
5. Emit 'execute' event with query
   ↓
6. AI Core processes (LLM + Tools)
   ↓
7. Stream response chunks via WebSocket
   ↓
8. MessageList displays chunks in real-time
   ↓
9. On complete: deduct credits
   ↓
10. Update credit balance in UI
```

### Document Upload Flow

```
1. User selects file in FileUploadModal
   ↓
2. Validate file (type, size)
   ↓
3. Read file content (PDF/DOCX/TXT)
   ↓
4. Chunk document: chunkService.chunkDocument()
   ↓
5. Generate embeddings: vectordbService.generateEmbeddings()
   ↓
6. Store in Qdrant: vectordbService.insertDocument()
   ↓
7. Deduct credits: paymentService.deductCredits()
   ↓
8. Update file list in SourcesManager
   ↓
9. Show success message
```

---

## Routing

### Public Routes

- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/forgot-password` - Password reset

### Protected Routes (require authentication)

- `/dashboard` - Main chat interface
- `/settings` - User settings
- `/profile` - User profile

### Route Protection

```typescript
// AppRoutes.tsx
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

---

## API Integration

### HTTP Client (Axios)

```typescript
// utils/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired, logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### WebSocket Client (Socket.IO)

```typescript
// services/socketService.ts
import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(import.meta.env.VITE_WEBSOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketService = new SocketService();
```

---

## Performance Optimization

### Code Splitting

```typescript
// App.tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/components/Dashboard'));
const Settings = lazy(() => import('@/pages/Settings'));

// In routes
<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

### Memoization

```typescript
// Expensive computation
const sortedMessages = useMemo(() => {
  return messages.sort((a, b) => a.timestamp - b.timestamp);
}, [messages]);

// Callback
const handleSubmit = useCallback(() => {
  // Handler logic
}, [dependencies]);

// Component
const MemoizedComponent = React.memo(Component);
```

### Image Optimization

- Use WebP format
- Lazy load images
- Use responsive images with srcset
- Compress images before deployment

---

## Security

### Authentication

- JWT tokens stored in localStorage
- Tokens included in Authorization header
- Automatic logout on token expiration
- Secure token refresh mechanism

### Input Validation

- Client-side validation with Zod
- Sanitize user input before rendering
- Validate file uploads (type, size)
- Never trust client-side validation alone

### XSS Protection

- React's built-in XSS protection
- Never use dangerouslySetInnerHTML
- Sanitize markdown content
- Content Security Policy headers (Nginx)

---

## Error Handling

### Error Boundary

```typescript
// components/error/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Log to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}
```

### API Error Handling

```typescript
try {
  const response = await authService.login(email, password);
  if (response.success) {
    // Handle success
  } else {
    setError(response.message);
  }
} catch (error) {
  setError('An unexpected error occurred');
  console.error('Login error:', error);
}
```

---

## Build & Deployment

### Development

```bash
npm run dev
# Runs on http://localhost:3000
```

### Production Build

```bash
npm run build
# Output: dist/
```

### Docker Deployment

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Environment Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:9999
VITE_WEBSOCKET_URL=ws://localhost:8000

# OAuth2 Configuration
VITE_OAUTH_AUTHORITY=http://localhost:8005
VITE_OAUTH_CLIENT_ID=frontend-client
VITE_OAUTH_REDIRECT_URI=http://localhost:3000/callback

# Feature Flags
VITE_ENABLE_OAUTH=true
VITE_ENABLE_INTRO_TOUR=true
```

---

## Key Principles

1. **Component-Based**: Build UI from small, reusable components
2. **Type Safety**: Use TypeScript for all code
3. **Separation of Concerns**: Components, services, state management
4. **Performance First**: Code splitting, memoization, lazy loading
5. **Security**: Input validation, XSS protection, secure auth
6. **User Experience**: Loading states, error handling, responsive design
7. **Maintainability**: Clear structure, consistent patterns, documentation

---

## Integration Points

### Backend Services

- **API Gateway** (http://localhost:9999) - All REST API calls
- **AI Core** (ws://localhost:8000) - WebSocket for chat streaming
- **Auth Server** (OAuth2) - Social login (future)

### External Services

- **Google Fonts** - Typography
- **CDN** - Static assets (production)

---

## Future Enhancements

- [ ] Progressive Web App (PWA)
- [ ] Offline mode with service workers
- [ ] Push notifications
- [ ] Mobile apps (React Native)
- [ ] Desktop app (Electron)
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Performance monitoring (Web Vitals)

---

**Last Updated**: 2025-02-27  
**Version**: 1.0
