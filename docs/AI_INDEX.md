# AI Documentation Index

When generating code for neura-frontend, ALWAYS read these documents in order:

## 1. AI_RULES.md

**Purpose**: Coding standards and rules  
**Read this for**:

- TypeScript patterns
- React component patterns
- Code style rules
- Security rules
- Testing rules
- DO NOT DO list

**Key sections**:

- Global Rules (TypeScript, React, State, API, Styling, Forms, Security)
- Architecture Rules (Component structure, File organization, Import order)
- Code Style Rules (Component pattern, Service pattern, Hook pattern)
- Specific Rules (Authentication, WebSocket, File upload, Error handling)
- DO NOT DO (Critical mistakes to avoid)

## 2. ARCHITECTURE.md

**Purpose**: System architecture and structure  
**Read this for**:

- High-level architecture
- Directory structure
- Component hierarchy
- State management (Context, Zustand, Local)
- Data flow (Auth, Chat, Document upload)
- Routing (Public/Protected routes)
- API integration (HTTP, WebSocket)
- Performance optimization

**Key sections**:

- Component Hierarchy
- State Management (AuthContext, LocaleContext, Zustand stores)
- Data Flow (Authentication, Chat, Document upload)
- API Integration (apiClient, socketService)
- Performance Optimization (Code splitting, Memoization)

## 3. DOMAIN.md

**Purpose**: Business domain and user workflows  
**Read this for**:

- Product overview
- Core concepts (Document KB, Credit system, Subscriptions)
- User personas (Teacher, Lecturer)
- User workflows (Onboarding, Lesson preparation, Document management)
- Key features (Landing page, Auth, Dashboard, Settings)
- Business rules (Document upload, Credits, Rate limiting)
- UI patterns (Loading, Error, Success states)

**Key sections**:

- Core Concepts (Document Knowledge Base, Document Scope, Credit System)
- User Personas (Primary: Teacher, Secondary: Lecturer)
- User Workflows (4 detailed workflows)
- Key Features (Landing, Auth, Dashboard, Document Management, Settings)
- Business Rules (Upload limits, Credit costs, Rate limits)

---

## Quick Reference

### When adding a new component:

1. Read AI_RULES.md → Section 3 (Code Style Rules) → Component Pattern
2. Read ARCHITECTURE.md → Component Hierarchy
3. Follow TypeScript strict mode
4. Use Tailwind CSS for styling
5. Handle loading and error states

### When adding a new feature:

1. Read DOMAIN.md → Understand business context
2. Read ARCHITECTURE.md → Understand data flow
3. Read AI_RULES.md → Follow coding standards
4. Implement service layer first
5. Then implement UI components

### When fixing a bug:

1. Read ARCHITECTURE.md → Understand system flow
2. Read AI_RULES.md → Check for rule violations
3. Read DOMAIN.md → Understand expected behavior
4. Fix root cause, not symptoms
5. Add tests to prevent regression

### When refactoring:

1. Read AI_RULES.md → Ensure compliance
2. Read ARCHITECTURE.md → Maintain structure
3. Keep backward compatibility
4. Update documentation
5. Verify tests still pass

---

## File Locations

```
neura-frontend/docs/
├── AI_INDEX.md          # This file (index)
├── AI_RULES.md          # Coding rules and standards
├── ARCHITECTURE.md      # System architecture
├── DOMAIN.md            # Business domain knowledge
├── TECHNICAL_SPECIFICATION.md  # Detailed technical spec
└── PRODUCT_DOCUMENT.md  # Product requirements
```

---

## Priority Order

When generating code, read in this priority:

**Priority 1 (MUST READ)**:

1. AI_RULES.md - Coding standards
2. ARCHITECTURE.md - System structure
3. DOMAIN.md - Business context

**Priority 2 (REFERENCE)**: 4. TECHNICAL_SPECIFICATION.md - Detailed specs 5. PRODUCT_DOCUMENT.md - Product requirements

---

## Common Scenarios

### Scenario: Add new page component

**Read**:

1. AI_RULES.md → Component Pattern
2. ARCHITECTURE.md → Routing, Component Hierarchy
3. DOMAIN.md → User workflow for that page

**Steps**:

1. Create component in `src/pages/`
2. Add route in `AppRoutes.tsx`
3. Add to component hierarchy
4. Follow TypeScript strict mode
5. Use Tailwind CSS
6. Handle loading/error states

### Scenario: Add API integration

**Read**:

1. AI_RULES.md → API Calls section
2. ARCHITECTURE.md → API Integration
3. DOMAIN.md → Business rules

**Steps**:

1. Create service in `src/services/`
2. Use apiClient from `@/utils/apiClient`
3. Handle loading/error states
4. Return consistent response format
5. Add TypeScript types

### Scenario: Add state management

**Read**:

1. AI_RULES.md → State Management section
2. ARCHITECTURE.md → State Management
3. DOMAIN.md → Data requirements

**Steps**:

1. Decide: Context (global) vs Zustand (complex) vs Local (component)
2. Create context/store if needed
3. Follow TypeScript patterns
4. Keep state minimal
5. Avoid prop drilling

### Scenario: Add form with validation

**Read**:

1. AI_RULES.md → Forms section
2. ARCHITECTURE.md → Component Pattern
3. DOMAIN.md → Business rules for validation

**Steps**:

1. Create Zod schema for validation
2. Use controlled inputs (useState)
3. Validate on submit
4. Show inline errors
5. Handle loading state
6. Clear form on success

---

## Key Principles (Quick Reminder)

1. **TypeScript Strict Mode**: No `any`, always type everything
2. **React Functional Components**: Use hooks, no class components
3. **Tailwind CSS**: Use utility classes, no custom CSS
4. **Service Layer**: Never make API calls in components
5. **Error Handling**: Always handle loading and error states
6. **Security**: Validate input, sanitize output, never trust client
7. **Performance**: Code splitting, memoization, lazy loading
8. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

---

## Contact

If documentation is unclear or outdated:

1. Check existing code for patterns
2. Ask for clarification
3. Update documentation after changes

---

**Last Updated**: 2025-02-27  
**Version**: 1.0  
**Maintained by**: NeuraAgent Team
