# Neura Platform Frontend

A high-performance, responsive React application built with TypeScript and Vite. This is the primary user interface for the Neura AI platform.

> [!IMPORTANT]
> **Isolated Development**: To work only on this codebase without needing context from the rest of the repository, please refer to the **[DEVELOPER_GUIDE.md](file:///Users/hoabui/Desktop/neura/neura-frontend/DEVELOPER_GUIDE.md)**.

## 🚀 Features

- **AI-Powered Chat**: Real-time conversational AI with streaming responses
- **Document Processing**: OCR-supported file handling (PDF, DOCX, TXT, MD)
- **State Management**: Scalable architecture using React Context and Zustand
- **Real-time Updates**: WebSocket (Socket.IO) integration
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Authentication**: JWT-based security with OAuth2 support

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: React Context + Zustand
- **Routing**: React Router v7
- **HTTP/WS**: Axios + Socket.IO

---

## 🚀 Quick Start

1. **Setup Environment**:
```bash
cp .env.example .env
```

2. **Run Development Server**:
```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 📚 Documentation

For deeper dives into the codebase, refer to these internal documents:
- **[DEVELOPER_GUIDE.md](file:///Users/hoabui/Desktop/neura/neura-frontend/DEVELOPER_GUIDE.md)**: Main isolation manual.
- **[docs/ARCHITECTURE.md](file:///Users/hoabui/Desktop/neura/neura-frontend/docs/ARCHITECTURE.md)**: System design and state flow.
- **[docs/AI_RULES.md](file:///Users/hoabui/Desktop/neura/neura-frontend/docs/AI_RULES.md)**: Coding standards for React and TypeScript.

---

Built with ❤️ using React + TypeScript + Vite

