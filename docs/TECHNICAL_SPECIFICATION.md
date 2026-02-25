# Frontend Service - Technical Specification

## Document Information

- **Service Name**: frontend-service
- **Version**: 1.0.10
- **Last Updated**: 2025-01-11
- **Owner**: Frontend Team
- **Status**: Production
- **Port**: 3000 (dev), 80 (production)
- **Repository**: `/services/frontend-service`

---

## 1. Technical Overview

### 1.1 Purpose

The Frontend Service is a React-based single-page application (SPA) that provides the user interface for the Agent Education platform. It handles user interactions, communicates with backend services via REST APIs and WebSocket, and manages client-side state.

### 1.2 Technology Stack

| Component      | Technology        | Version  | Justification                                       |
| -------------- | ----------------- | -------- | --------------------------------------------------- |
| **Framework**  | React             | 18.2.0   | Industry standard, large ecosystem, hooks API       |
| **Language**   | TypeScript        | 5.0+     | Type safety, better DX, fewer runtime errors        |
| **Build Tool** | Vite              | 5.0+     | Fast HMR, optimized builds, modern tooling          |
| **Styling**    | Tailwind CSS      | 3.4+     | Utility-first, rapid development, consistent design |
| **State**      | React Context     | Built-in | Simple, no external deps for global state           |
| **State**      | Zustand           | 4.4+     | Lightweight, simple API for complex state           |
| **Routing**    | React Router      | 6.20+    | Standard routing solution, v6 improvements          |
| **HTTP**       | Axios             | 1.6+     | Interceptors, request cancellation, better API      |
| **WebSocket**  | Socket.IO Client  | 4.6+     | Auto-reconnection, fallbacks, event-based           |
| **Forms**      | React Hook Form   | 7.49+    | Performance, less re-renders, easy validation       |
| **Validation** | Zod               | 3.22+    | TypeScript-first, runtime validation                |
| **i18n**       | Custom Context    | -        | Lightweight, no external deps needed                |
| **Markdown**   | react-markdown    | 9.0+     | Secure, extensible, supports plugins                |
| **Code**       | react-code-blocks | 0.1+     | Syntax highlighting, copy functionality             |
| **Math**       | KaTeX             | 0.16+    | Fast, LaTeX-compatible, no MathJax overhead         |
| **Icons**      | Lucide React      | 0.300+   | Modern, tree-shakeable, consistent style            |
| **OAuth**      | oidc-client-ts    | 2.4+     | OAuth2/OIDC standard, well-maintained               |

### 1.3 Architecture Principles

**Single Page Application (SPA)**:

- Client-side routing
- Dynamic content loading
- No full page reloads
- Better user experience

**Component-Based Architecture**:

- Reusable components
- Composition over inheritance
- Props for data flow
- Context for global state

**Separation of Concerns**:

- Components (UI)
- Services (API calls)
- Contexts (State management)
- Utils (Helper functions)

**Performance First**:

- Code splitting
- Lazy loading
- Memoization
- Optimized re-renders

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND SERVICE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PRESENTATION LAYER                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ Components │  │   Pages    │  │   Layouts  │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              STATE MANAGEMENT LAYER                   │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │  Context   │  │   Zustand  │  │Local State │     │  │
│  │  │    API     │  │   Stores   │  │  (useState)│     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              SERVICE LAYER                            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │    Auth    │  │  Payment   │  │  Socket    │     │  │
│  │  │  Service   │  │  Service   │  │  Service   │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              COMMUNICATION LAYER                      │  │
│  │  ┌────────────┐  ┌────────────┐                      │  │
│  │  │    HTTP    │  │ WebSocket  │                      │  │
│  │  │   (Axios)  │  │(Socket.IO) │                      │  │
│  │  └────────────┘  └────────────┘                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │API Gateway │  │  AI_core   │  │  Payment   │           │
│  │  (REST)    │  │(WebSocket) │  │  Service   │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Project Structure

```
frontend-service/
├── src/
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── OAuthCallback.tsx
│   │   │
│   │   ├── chat/               # Chat interface
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── MessageList.tsx
│   │   │   └── ModelSelector.tsx
│   │   │
│   │   ├── landing/            # Landing page
│   │   │   ├── LandingNav.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── CreditUsageSection.tsx
│   │   │   ├── DevelopersSection.tsx
│   │   │   ├── SecuritySection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── error/              # Error handling
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── ErrorPage.tsx
│   │   │   └── RouteErrorBoundary.tsx
│   │   │
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── Settings.tsx        # Settings page
│   │   ├── Profile.tsx         # User profile
│   │   ├── LandingPage.tsx     # Landing page container
│   │   ├── Logo.tsx            # Brand logo
│   │   ├── LanguageSwitcher.tsx
│   │   ├── IntroTour.tsx       # Onboarding tour
│   │   ├── SourcesManager.tsx  # Document management
│   │   ├── FloatingCreditIndicator.tsx
│   │   └── CreditBalance.tsx
│   │
│   ├── contexts/               # React contexts
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── LocaleContext.tsx   # i18n state
│   │
│   ├── services/               # API services
│   │   ├── authService.ts      # Auth API calls
│   │   ├── paymentService.ts   # Payment API calls
│   │   ├── socketService.ts    # WebSocket service
│   │   └── oidcService.ts      # OAuth2 service
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
│   │   └── env.ts              # Environment validation
│   │
│   ├── locales/                # i18n translations
│   │   ├── vi.json             # Vietnamese
│   │   └── en.json             # English
│   │
│   ├── styles/                 # Global styles
│   │   └── index.css
│   │
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
│
├── public/                     # Static assets
│   ├── favicon.ico
│   └── logo.png
│
├── scripts/                    # Build scripts
│   └── validate-env.js
│
├── .env                        # Environment variables
├── .env.example                # Environment template
├── .eslintrc.cjs               # ESLint config
├── .prettierrc                 # Prettier config
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies
├── Dockerfile                  # Docker image
├── nginx.conf                  # Nginx configuration
└── README.md                   # Documentation
```

## 3. Component Architecture

### 3.1 Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── LocaleProvider (Context)
│       └── BrowserRouter
│           ├── LandingPage
│           │   ├── LandingNav
│           │   ├── HeroSection
│           │   ├── FeaturesSection
│           │   ├── HowItWorksSection
│           │   ├── PricingSection
│           │   ├── CreditUsageSection
│           │   ├── DevelopersSection
│           │   ├── SecuritySection
│           │   ├── CTASection
│           │   └── Footer
│           │
│           ├── Dashboard (Protected)
│           │   ├── IntroTour
│           │   ├── Sidebar
│           │   │   ├── Logo
│           │   │   ├── UserMenu
│           │   │   ├── SourcesManager
│           │   │   └── ClearButton
│           │   ├── ChatArea
│           │   │   ├── FloatingCreditIndicator
│           │   │   ├── MessageList
│           │   │   │   └── ChatMessage (multiple)
│           │   │   └── ChatInput
│           │   │       ├── ModelSelector
│           │   │       └── SendButton
│           │   └── ErrorBoundary
│           │
│           ├── Settings (Protected)
│           │   ├── ProfileTab
│           │   ├── CreditsTab
│           │   │   └── CreditBalance
│           │   └── PreferencesTab
│           │
│           └── Profile (Protected)
│               └── ProfileForm
```

### 3.2 State Management

#### AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  signUp: (data: SignUpRequest) => Promise<SignUpResponse>;
  forgotPassword: (email: string) => Promise<ForgotPasswordResponse>;
  setOAuthUser: (user: any) => Promise<void>;
  isOAuthAuthenticated: () => Promise<boolean>;
}
```

#### LocaleContext

```typescript
interface LocaleContextType {
  locale: 'vi' | 'en';
  setLocale: (locale: 'vi' | 'en') => void;
  t: (key: string) => string;
}
```

#### UserStore (Zustand)

```typescript
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  fileIds: string[];
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  addFileId: (fileId: string) => void;
  removeFileId: (fileId: string) => void;
  getFileIds: () => string[];
}
```

### 3.3 Component Patterns

**Container/Presentational Pattern**:

- Containers handle logic and state
- Presentational components handle UI
- Clear separation of concerns

**Composition Pattern**:

- Build complex UIs from simple components
- Props for customization
- Children for flexibility

**Render Props Pattern**:

- Share code between components
- Flexible component behavior
- Used in ErrorBoundary

---

## 4. API Documentation

### 4.1 REST API Integration

**Base URL**: `http://localhost:9999/api` (via API Gateway)

#### Authentication APIs

**Login**:

```typescript
POST / auth / login;
Request: {
  email: string;
  password: string;
}
Response: {
  success: boolean;
  data: {
    token: string;
    user: User;
  }
}
```

**Sign Up**:

```typescript
POST /auth/signup
Request: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  dateOfBirth?: string;
}
Response: {
  success: boolean;
  data: {
    token: string;
    user: User;
  }
}
```

**Logout**:

```typescript
POST / auth / logout;
Headers: {
  Authorization: Bearer<token>;
}
Response: {
  success: boolean;
  message: string;
}
```

#### Payment APIs

**Get Credit Balance**:

```typescript
GET / payment / credits / balance;
Headers: {
  Authorization: Bearer<token>;
}
Response: {
  success: boolean;
  data: {
    totalCredits: number;
    usedCredits: number;
    availableCredits: number;
    bonusCredits: number;
    subscriptionCredits: number;
    purchasedCredits: number;
  }
}
```

**Get Subscription Plans**:

```typescript
GET /payment/subscriptions/plans
Response: {
  success: boolean;
  data: [
    {
      id: string;
      planCode: string;
      planName: string;
      price: number;
      creditsIncluded: number;
      features: object;
    }
  ]
}
```

**Get Pricing Rules**:

```typescript
GET /payment/pricing/rules
Response: {
  success: boolean;
  data: [
    {
      serviceType: string;
      serviceName: string;
      creditsPerRequest: number;
      creditsPer1kTokens: number;
    }
  ]
}
```

#### Settings APIs

**Get Chunk Settings**:

```typescript
GET / settings / chunk;
Response: {
  success: boolean;
  data: {
    chunkSize: number;
    chunkOverlap: number;
    subject: string;
    week: string;
    title: string;
  }
}
```

### 4.2 WebSocket Events

**Connection**:

```typescript
const socket = io('http://localhost:8000', {
  transports: ['websocket'],
  auth: {
    token: authToken,
  },
});
```

**Client → Server Events**:

```typescript
// Execute AI query
socket.emit('execute', {
  version: 'v1.0',
  query: string,
  session_id: string,
  user_id: string,
  channel_id: string,
  available_files: string[],
  llm_model: string,
  user_info: {
    firstName: string,
    lastName: string
  }
});
```

**Server → Client Events**:

```typescript
// Connection established
socket.on('connected', data => {
  console.log('Connected:', data.status);
});

// Execution started
socket.on('execution_started', data => {
  console.log('Started:', data.session_id);
});

// Agent thinking
socket.on('agent_thinking', data => {
  console.log('Thinking:', data.message);
});

// Tool calling
socket.on('tool_calling', data => {
  console.log('Tool:', data.tool_name);
});

// Response chunk (streaming)
socket.on('response_chunk', data => {
  appendToResponse(data.chunk);
});

// Execution complete
socket.on('execution_complete', data => {
  console.log('Complete:', data.result);
  updateCreditBalance();
});

// Execution error
socket.on('execution_error', data => {
  console.error('Error:', data.error);
});
```

---

## 5. Integration Points

### 5.1 External Dependencies

**API Gateway** (http://localhost:9999):

- Purpose: All API requests route through gateway
- Used for: Auth, Payment, Settings APIs
- Failure mode: Show error message, retry mechanism

**AI_core** (ws://localhost:8000):

- Purpose: WebSocket connection for AI chat
- Used for: Real-time chat streaming
- Failure mode: Fallback to REST API, show connection error

**Auth Server** (OAuth2):

- Purpose: OAuth2 authentication (Google login)
- Used for: Social login
- Failure mode: Fallback to email/password login

### 5.2 Service Communication Flow

```
Frontend → API Gateway → Backend Services
   ↓
WebSocket → AI_core → MCP/VectorDB
   ↓
Event Listeners → UI Updates
```

**Chat Flow**:

```
1. User types message
2. Frontend checks credits (API Gateway → Payment Service)
3. Frontend sends via WebSocket (AI_core)
4. AI_core validates token (Auth Server)
5. AI_core processes (LLM + Tools)
6. AI_core streams response (WebSocket)
7. Frontend displays chunks
8. AI_core deducts credits (Payment Service)
9. Frontend updates balance
```

**Document Upload Flow**:

```
1. User selects file
2. Frontend fetches settings (API Gateway → Settings Service)
3. Frontend chunks document (client-side)
4. Frontend generates embeddings (API Gateway → Embedding Service)
5. Frontend stores vectors (API Gateway → VectorDB Service)
6. Payment Service deducts credits
7. Frontend confirms success
```

---

## 6. Configuration

### 6.1 Environment Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:9999
VITE_WEBSOCKET_URL=ws://localhost:8000

# OAuth2 Configuration
VITE_OAUTH_AUTHORITY=http://localhost:8005
VITE_OAUTH_CLIENT_ID=frontend-client
VITE_OAUTH_REDIRECT_URI=http://localhost:3000/callback
VITE_OAUTH_SCOPE=openid profile email

# Application Configuration
VITE_APP_NAME=Agent Education
VITE_APP_VERSION=1.0.10

# Feature Flags
VITE_ENABLE_OAUTH=true
VITE_ENABLE_INTRO_TOUR=true
VITE_ENABLE_DOCUMENT_UPLOAD=true

# Environment
NODE_ENV=development
```

### 6.2 Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true,
      },
    },
  },
});
```

### 6.3 Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

## 7. Deployment

### 7.1 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run type checking
npm run type-check

# Format code
npm run format
```

### 7.2 Docker Deployment

**Dockerfile**:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run**:

```bash
# Build image
docker build -t frontend-service:1.0.10 .

# Run container
docker run -p 3000:80 \
  -e VITE_API_URL=http://api-gateway:9999 \
  frontend-service:1.0.10
```

### 7.3 Production Deployment

**Nginx Configuration**:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://api-gateway:9999;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket proxy
    location /socket.io {
        proxy_pass http://ai-core:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 7.4 Health Checks

The frontend service doesn't have a traditional health endpoint, but you can check:

```bash
# Check if container is running
docker ps | grep frontend-service

# Check if Nginx is serving
curl http://localhost:3000

# Check if build is successful
ls -la dist/
```

---

## 8. Security

### 8.1 Authentication

**JWT Token Management**:

- Tokens stored in localStorage
- Token included in Authorization header
- Token validated on every API request
- Token refresh mechanism (24h expiration)
- Automatic logout on token expiration

**OAuth2 Flow**:

```
1. User clicks "Login with Google"
2. Redirect to OAuth2 provider
3. User authorizes
4. Redirect back with authorization code
5. Exchange code for token
6. Store token and user info
7. Redirect to dashboard
```

### 8.2 Data Protection

**Sensitive Data**:

- Never log passwords or tokens
- Sanitize user input before display
- Use HTTPS in production
- Secure WebSocket (WSS) in production

**XSS Protection**:

- React's built-in XSS protection
- Sanitize markdown content
- Content Security Policy headers
- No dangerouslySetInnerHTML usage

**CSRF Protection**:

- SameSite cookies
- CSRF tokens for state-changing operations
- Origin validation

### 8.3 Input Validation

**Client-Side Validation**:

```typescript
// Using Zod
const signupSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^(\+84|0)[0-9]{9,10}$/),
  password: z.string().min(8).max(100),
  dateOfBirth: z.string().optional(),
});
```

**File Upload Validation**:

```typescript
const validateFile = (file: File) => {
  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large');
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
};
```

---

## 9. Performance

### 9.1 Performance Characteristics

| Metric                       | Target  | Current |
| ---------------------------- | ------- | ------- |
| **First Contentful Paint**   | < 1.5s  | ~1.2s   |
| **Time to Interactive**      | < 3s    | ~2.5s   |
| **Largest Contentful Paint** | < 2.5s  | ~2.0s   |
| **Bundle Size**              | < 500KB | ~450KB  |
| **Lighthouse Score**         | > 90    | 92      |

### 9.2 Optimization Strategies

**Code Splitting**:

```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./components/Dashboard'));
const Settings = lazy(() => import('./components/Settings'));
const Profile = lazy(() => import('./components/Profile'));
```

**Image Optimization**:

- Use WebP format
- Lazy load images
- Responsive images with srcset
- Compress images before upload

**Caching**:

```typescript
// Service Worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Cache API responses
const cache = new Map();
const getCachedData = async (key: string, fetcher: () => Promise<any>) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const data = await fetcher();
  cache.set(key, data);
  return data;
};
```

**Bundle Optimization**:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-markdown'],
          'socket-vendor': ['socket.io-client'],
        },
      },
    },
  },
});
```

### 9.3 WebSocket Optimization

**Connection Management**:

```typescript
// Reconnection strategy
const socket = io(WEBSOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

// Heartbeat to keep connection alive
setInterval(() => {
  socket.emit('ping');
}, 30000);
```

**Message Batching**:

```typescript
// Batch response chunks for smoother rendering
let buffer = '';
let timeoutId: NodeJS.Timeout;

socket.on('response_chunk', data => {
  buffer += data.chunk;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    setStreamingResponse(prev => prev + buffer);
    buffer = '';
  }, 50); // Batch every 50ms
});
```

---

## 10. Monitoring & Observability

### 10.1 Error Tracking

**Error Boundary**:

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service
    console.error('Error caught:', error, errorInfo);

    // Send to backend
    fetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      }),
    });
  }
}
```

**Global Error Handler**:

```typescript
window.addEventListener('error', event => {
  console.error('Global error:', event.error);
  // Send to error tracking
});

window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  // Send to error tracking
});
```

### 10.2 Analytics

**User Actions**:

```typescript
const trackEvent = (event: string, properties?: object) => {
  // Send to analytics service
  console.log('Track:', event, properties);

  // Example: Google Analytics
  if (window.gtag) {
    window.gtag('event', event, properties);
  }
};

// Usage
trackEvent('message_sent', { model: 'gemini', credits: 1 });
trackEvent('document_uploaded', { fileType: 'pdf', size: 1024 });
trackEvent('subscription_upgraded', { plan: 'premium' });
```

**Performance Monitoring**:

```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 10.3 Logging

**Console Logging**:

```typescript
const logger = {
  info: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to error tracking
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },
};
```

---

## 11. Testing

### 11.1 Unit Tests

**Component Testing**:

```typescript
// ChatMessage.test.tsx
import { render, screen } from '@testing-library/react';
import ChatMessage from './ChatMessage';

describe('ChatMessage', () => {
  it('renders user message correctly', () => {
    render(
      <ChatMessage
        role="user"
        content="Hello AI"
        timestamp="10:00 AM"
      />
    );
    expect(screen.getByText('Hello AI')).toBeInTheDocument();
  });

  it('renders assistant message with markdown', () => {
    render(
      <ChatMessage
        role="assistant"
        content="**Bold text**"
        timestamp="10:01 AM"
      />
    );
    expect(screen.getByText('Bold text')).toBeInTheDocument();
  });
});
```

**Service Testing**:

```typescript
// authService.test.ts
import { authService } from './authService';

describe('authService', () => {
  it('logs in successfully', async () => {
    const response = await authService.login('test@example.com', 'password');
    expect(response.success).toBe(true);
    expect(response.data.token).toBeDefined();
  });

  it('handles login error', async () => {
    const response = await authService.login('invalid@example.com', 'wrong');
    expect(response.success).toBe(false);
    expect(response.message).toContain('Invalid credentials');
  });
});
```

### 11.2 Integration Tests

**API Integration**:

```typescript
// api.integration.test.ts
describe('API Integration', () => {
  it('fetches credit balance', async () => {
    const balance = await paymentService.getCreditBalance();
    expect(balance.totalCredits).toBeGreaterThan(0);
    expect(balance.availableCredits).toBeLessThanOrEqual(balance.totalCredits);
  });

  it('fetches subscription plans', async () => {
    const plans = await paymentService.getSubscriptionPlans();
    expect(plans.length).toBeGreaterThan(0);
    expect(plans[0]).toHaveProperty('planName');
  });
});
```

### 11.3 E2E Tests

**User Flow Testing** (Playwright):

```typescript
// e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test('user can send message and receive response', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Wait for dashboard
  await page.waitForURL('**/dashboard');

  // Send message
  await page.fill('[data-tour="chat-input"]', 'Hello AI');
  await page.click('button[type="submit"]');

  // Wait for response
  await page.waitForSelector('.assistant-message');
  const response = await page.textContent('.assistant-message');
  expect(response).toBeTruthy();
});
```

---

## 12. Development Guide

### 12.1 Getting Started

```bash
# Clone repository
git clone <repo-url>
cd services/frontend-service

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### 12.2 Code Style

**ESLint Configuration**:

```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
```

**Prettier Configuration**:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### 12.3 Git Workflow

**Branch Naming**:

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Urgent production fixes
- `refactor/` - Code refactoring

**Commit Messages**:

```
feat: add document upload feature
fix: resolve WebSocket connection issue
refactor: improve chat message rendering
docs: update README with deployment steps
```

**Pre-commit Hooks**:

```bash
# .husky/pre-commit
npm run lint
npm run type-check
npm run format:check
```

### 12.4 Adding New Features

**Step 1: Create Component**

```typescript
// src/components/NewFeature.tsx
import React from 'react';

export const NewFeature: React.FC = () => {
  return <div>New Feature</div>;
};
```

**Step 2: Add Route**

```typescript
// src/App.tsx
<Route path="/new-feature" element={<NewFeature />} />
```

**Step 3: Add i18n**

```json
// src/locales/en.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "Description"
  }
}
```

**Step 4: Add Tests**

```typescript
// src/components/NewFeature.test.tsx
describe('NewFeature', () => {
  it('renders correctly', () => {
    // Test implementation
  });
});
```

---

## 13. Troubleshooting

### 13.1 Common Issues

#### Issue 1: WebSocket Connection Failed

**Symptoms**: Chat not working, "Connection failed" error
**Causes**:

- AI_core service not running
- CORS configuration issue
- Firewall blocking WebSocket

**Solutions**:

```bash
# Check if AI_core is running
curl http://localhost:8000/health

# Check WebSocket connection
wscat -c ws://localhost:8000/socket.io

# Update CORS in AI_core
CORS_ORIGIN=http://localhost:3000
```

#### Issue 2: API Requests Failing

**Symptoms**: 401 Unauthorized, 500 Internal Server Error
**Causes**:

- Invalid or expired token
- API Gateway not running
- Backend service down

**Solutions**:

```bash
# Check token
console.log(localStorage.getItem('auth_token'));

# Check API Gateway
curl http://localhost:9999/health

# Clear token and re-login
localStorage.removeItem('auth_token');
```

#### Issue 3: Build Fails

**Symptoms**: `npm run build` fails with TypeScript errors
**Causes**:

- Type errors in code
- Missing dependencies
- Outdated packages

**Solutions**:

```bash
# Check TypeScript errors
npm run type-check

# Update dependencies
npm update

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue 4: Slow Performance

**Symptoms**: Slow page load, laggy UI
**Causes**:

- Large bundle size
- Too many re-renders
- Memory leaks

**Solutions**:

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Check for memory leaks
# Use React DevTools Profiler

# Optimize images
# Use WebP format, lazy loading
```

### 13.2 Debug Mode

**Enable Debug Logging**:

```typescript
// src/utils/logger.ts
const DEBUG = import.meta.env.DEV;

export const logger = {
  debug: (...args: any[]) => {
    if (DEBUG) console.log('[DEBUG]', ...args);
  },
  info: (...args: any[]) => {
    console.log('[INFO]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};
```

**React DevTools**:

- Install React DevTools extension
- Use Profiler to identify performance issues
- Use Components tab to inspect state

**Network Debugging**:

```typescript
// Log all API requests
axios.interceptors.request.use(request => {
  console.log('Request:', request);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});
```

---

## 14. FAQ

### Q1: How do I add a new language?

**A**:

1. Create new locale file: `src/locales/fr.json`
2. Add translations for all keys
3. Update LocaleContext to support new language
4. Add language option to LanguageSwitcher

### Q2: How do I customize the theme?

**A**:

1. Update `tailwind.config.js` with new colors
2. Update CSS variables in `src/styles/index.css`
3. Update component styles as needed

### Q3: How do I add a new AI model?

**A**:

1. Add model to `MODEL_OPTIONS` in Dashboard.tsx
2. Update model selection logic
3. Ensure backend supports the model

### Q4: How do I enable OAuth2 login?

**A**:

1. Set `VITE_ENABLE_OAUTH=true` in .env
2. Configure OAuth2 settings
3. Ensure auth-server is running
4. Test login flow

### Q5: How do I deploy to production?

**A**:

1. Build production bundle: `npm run build`
2. Build Docker image: `docker build -t frontend:prod .`
3. Push to registry: `docker push frontend:prod`
4. Deploy to server: `docker-compose up -d`

---

## 15. References

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [React Router Documentation](https://reactrouter.com/)
- [Zod Documentation](https://zod.dev/)

**Internal Documentation**:

- [SETUP_SUMMARY.md](./SETUP_SUMMARY.md) - Setup guide
- [AUTH_README.md](./AUTH_README.md) - Authentication guide
- [OAUTH_README.md](./OAUTH_README.md) - OAuth2 guide
- [QUICK_START_LANDING.md](./QUICK_START_LANDING.md) - Landing page guide

---

## 16. Changelog

### Version 1.0.10 (2025-01-11)

- ✅ Complete technical specification created
- ✅ Credit balance UI redesigned (2026 AI trends)
- ✅ WebSocket streaming optimized
- ✅ Multi-language support enhanced
- ✅ Error handling improved

### Version 1.0.9 (2025-01-10)

- Added intro tour feature
- Improved document upload flow
- Enhanced credit balance display

### Version 1.0.8 (2025-01-09)

- Added OAuth2 Google login
- Improved mobile responsiveness
- Fixed WebSocket reconnection issues

---

**Document Version**: 1.0
**Last Updated**: 2025-01-11
**Status**: Complete
**Next Review**: 2025-02-11
