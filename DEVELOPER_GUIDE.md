# Neura Frontend Developer Guide (Isolated Development)

Welcome to the `neura-frontend` repository. This document is the primary reference for developers working exclusively on the Neura React application.

## 🏗️ Architecture Overview

The `neura-frontend` is a modern, responsive Single Page Application (SPA) built with React 18 and TypeScript, optimized for high-performance AI interactions.

### Core Architecture
- **Framework**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **State Management**:
    - **Session**: [React Context](file:///Users/hoabui/Desktop/neura/neura-frontend/src/contexts/) (Auth, Locale)
    - **Complex Logic**: [Zustand](file:///Users/hoabui/Desktop/neura/neura-frontend/src/stores/) (User, Tour)
- **UI System**:
    - **Styling**: [Tailwind CSS](https://tailwindcss.com/)
    - **Icons**: [Lucide React](https://lucide.dev/)
- **Communication**: [Axios](https://axios-http.com/) (REST) + [Socket.IO Client](https://socket.io/) (WebSocket)

---

## 🚀 Getting Started

### 1. Environment Configuration
Copy the `.env.example` to `.env` at the root of `neura-frontend/`:
```bash
cp .env.example .env
```
Ensure that `VITE_API_GATEWAY_URL` points to `http://localhost:9999` to communicate with the `NeuraAgent` API gateway.

### 2. Development Workflow
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The application will be available at `http://localhost:3000`.

### 3. Coding Standards
We follow strict standards for type safety and component modularity. Please refer to:
- **[docs/AI_RULES.md](file:///Users/hoabui/Desktop/neura/neura-frontend/docs/AI_RULES.md)**: Coding conventions for agents and developers.
- **[docs/ARCHITECTURE.md](file:///Users/hoabui/Desktop/neura/neura-frontend/docs/ARCHITECTURE.md)**: Deep dive into the component tree and state flow.

---

## 📂 Source Structure

- **[src/components/](file:///Users/hoabui/Desktop/neura/neura-frontend/src/components/)**: Reusable UI parts (dashboard, landing).
- **[src/services/](file:///Users/hoabui/Desktop/neura/neura-frontend/src/services/)**: API client logic (Auth, Payment, Socket).
- **[src/types/](file:///Users/hoabui/Desktop/neura/neura-frontend/src/types/)**: Centralized TypeScript interfaces.
- **[src/hooks/](file:///Users/hoabui/Desktop/neura/neura-frontend/src/hooks/)**: Custom React hooks for business logic isolation.

---

## 🛡️ Backend Integration

### Mocking vs. Live Backend
- **Live**: Ensure `NeuraAgent` is running via Docker Compose (`docker-compose up -d` in the root).
- **Mocking**: For unit tests, use the mock data provided in `src/utils/test-mocks.ts`.

### WebSocket Events
Real-time chat streaming uses the `execute` event over Socket.IO. See [TECHNICAL_SPECIFICATION.md](file:///Users/hoabui/Desktop/neura/neura-frontend/docs/TECHNICAL_SPECIFICATION.md) for event payload schemas.

---

## 📊 Deployment
- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Docker**: `docker build -t neura-frontend .`
