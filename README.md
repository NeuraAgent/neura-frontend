# Neura Frontend

Modern, responsive web application for Neura AI platform - an intelligent document processing and conversational AI system with RAG (Retrieval-Augmented Generation) capabilities.

## 🚀 Features

- **AI-Powered Chat**: Real-time conversational AI with streaming responses
- **Document Processing**: Upload and process documents (PDF, DOCX, TXT, MD) with OCR support
- **RAG System**: Semantic search across uploaded documents with hybrid vector search
- **Credit System**: Integrated NeuPay credit-based payment system
- **Multi-language**: Support for English and Vietnamese
- **Real-time Updates**: WebSocket-based real-time communication
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Authentication**: Secure OAuth2/OIDC authentication with JWT tokens

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**:
  - React Context (global state)
  - Zustand (client state)
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Real-time**: Socket.IO
- **Icons**: Lucide React
- **Code Quality**: ESLint + Prettier

## 📋 Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Backend services running (API Gateway, Auth Service, etc.)

## 🔧 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd neura-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure `.env` file:

```env
# API Configuration
VITE_API_GATEWAY_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000

# OAuth2 Configuration
VITE_OAUTH_CLIENT_ID=your-client-id
VITE_OAUTH_AUTHORITY=http://localhost:3001
VITE_OAUTH_REDIRECT_URI=http://localhost:5173/callback
VITE_OAUTH_SILENT_REDIRECT_URI=http://localhost:5173/silent-callback

# Feature Flags
VITE_ENABLE_OAUTH=false
```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## 🏗️ Project Structure

```
neura-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── landing/        # Landing page components
│   │   │   ├── components/ # Reusable landing components
│   │   │   ├── hooks/      # Custom hooks
│   │   │   └── utils/      # Utility functions
│   │   └── error/          # Error handling components
│   ├── contexts/           # React contexts
│   │   └── auth/           # Auth context modules
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   │   └── auth/           # Auth utilities
│   ├── constants/          # Constants
│   └── styles/             # Global styles
├── docs/                   # Documentation
├── public/                 # Static assets
└── dist/                   # Production build
```

## 🎨 Architecture

### Component Organization

Components follow SOLID principles and clean code practices:

- **Single Responsibility**: Each component has one clear purpose
- **Composition**: Small, reusable components composed together
- **Separation of Concerns**: Logic separated into hooks and utilities
- **Type Safety**: Full TypeScript coverage

### State Management

- **React Context**: Global state (auth, locale)
- **Zustand**: Complex client state (user store, tour store)
- **Local State**: Component-specific state with `useState`

### API Communication

- **Service Layer**: All API calls abstracted in service classes
- **Axios Interceptors**: Automatic token refresh and error handling
- **WebSocket**: Real-time updates via Socket.IO

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Design System**: Consistent colors, spacing, and typography
- **Responsive**: Mobile-first approach
- **Dark Theme**: Custom dark theme with gradient accents

## 🔐 Authentication

The application supports two authentication modes:

### 1. Standard Authentication (Default)

- Email/password login
- JWT token-based authentication
- Automatic token refresh

### 2. OAuth2/OIDC (Optional)

- OAuth2 authorization code flow with PKCE
- Silent token refresh
- Single Sign-On (SSO) support

Enable OAuth by setting `VITE_ENABLE_OAUTH=true` in `.env`

## 📱 Key Features

### Dashboard

- Real-time AI chat with streaming responses
- Document upload and management
- Source viewing with chunk navigation
- Credit balance tracking
- Model selection (Gemini, Qwen)

### Landing Page

- Hero section with animated gradients
- Feature showcase
- Pricing plans with dynamic data
- Documentation page
- Multi-language support

### Document Processing

- Drag-and-drop file upload
- OCR for scanned documents
- Automatic text extraction
- Chunk-based storage
- Semantic search

## 🌐 Internationalization

The application supports multiple languages:

- English (en)
- Vietnamese (vi)

Language files are located in `src/contexts/LocaleContext.tsx`

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format checking
npm run format
```

## 📦 Building for Production

1. Build the application:

```bash
npm run build
```

2. Preview the build:

```bash
npm run preview
```

3. Deploy the `dist/` folder to your hosting service

### Docker Deployment

Build Docker image:

```bash
docker build -t neura-frontend .
```

Run container:

```bash
docker run -p 80:80 neura-frontend
```

## 🔧 Configuration

### Environment Variables

| Variable               | Description          | Default                 |
| ---------------------- | -------------------- | ----------------------- |
| `VITE_API_GATEWAY_URL` | API Gateway URL      | `http://localhost:3000` |
| `VITE_SOCKET_URL`      | WebSocket URL        | `http://localhost:3000` |
| `VITE_OAUTH_CLIENT_ID` | OAuth2 client ID     | -                       |
| `VITE_OAUTH_AUTHORITY` | OAuth2 authority URL | -                       |
| `VITE_ENABLE_OAUTH`    | Enable OAuth2        | `false`                 |

### Tailwind Configuration

Custom theme configuration in `tailwind.config.js`:

- Custom colors
- Custom fonts
- Custom animations
- Custom utilities

## 📚 Documentation

Detailed documentation available in `/docs`:

- [Architecture](./docs/ARCHITECTURE.md) - System architecture
- [Domain](./docs/DOMAIN.md) - Domain model
- [AI Rules](./docs/AI_RULES.md) - Coding standards
- [Technical Specification](./docs/TECHNICAL_SPECIFICATION.md)

## 🤝 Contributing

1. Follow the coding standards in `docs/AI_RULES.md`
2. Use TypeScript strict mode
3. Write clean, maintainable code
4. Apply SOLID principles
5. Add proper type definitions
6. Run type-check and format before committing

### Code Style

- Use single quotes (`'`) for strings
- Use functional components with hooks
- Use `const` for immutable values
- Destructure props in function signature
- Use `useCallback` and `useMemo` for optimization
- Keep components small and focused

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Module not found:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Type errors:**

```bash
# Run type check
npm run type-check
```

## 📄 License

[Your License Here]

## 👥 Team

Developed by the Neura team

## 🔗 Related Projects

- [neura-admin](../neura-admin) - Admin dashboard
- [NeuraAgent](../NeuraAgent) - Backend services

## 📞 Support

For support, please contact [your-email@example.com]

---

Built with ❤️ using React + TypeScript + Vite
