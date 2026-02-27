# Domain Knowledge - Neura Frontend

This document describes the business domain and user workflows for the neura-frontend application.

---

## Product Overview

**Name**: NeuraAgent Web Application  
**Target Users**: Teachers, Educators, Students  
**Primary Use Case**: AI-powered document assistant with knowledge base  
**Key Value**: Upload teaching materials, select document scope, ask questions, get AI answers with sources

---

## Core Concepts

### 1. Document Knowledge Base
Teachers upload their teaching materials (PDFs, DOCX, TXT) to create a searchable knowledge base. The system:
- Chunks documents into smaller pieces
- Generates embeddings for semantic search
- Stores vectors in Qdrant
- Allows document scope selection for targeted queries

### 2. Document Scope Selection
Users can select specific documents before asking questions. This allows:
- Targeted search within relevant materials
- Faster, more accurate answers
- Better source attribution
- Efficient credit usage

### 3. Credit System
Users consume credits for AI operations:
- **Chat**: 1 credit per message
- **Document Upload**: 10 credits per document
- **Semantic Search**: 2 credits per query
- **Document Summary**: 5 credits

Credits are allocated via:
- **Subscription**: Monthly credit allocation
- **Purchase**: Pay-as-you-go credit purchase

### 4. Subscription Plans
- **Free**: 100 credits/month, 10 documents, 100MB storage
- **Basic**: 500 credits/month, 50 documents, 500MB storage
- **Premium**: 2000 credits/month, 200 documents, 2GB storage
- **Enterprise**: 10000 credits/month, unlimited documents, 10GB storage

---

## User Personas

### Primary Persona: Teacher (Ms. Nguyen)
**Background**:
- High school math teacher
- 50+ teaching documents (textbooks, notes, exercises)
- Prepares lessons daily
- Limited time for manual searching

**Goals**:
- Quickly find information across multiple documents
- Prepare lessons efficiently
- Get teaching suggestions from materials
- Organize teaching resources

**Pain Points**:
- Manual search is time-consuming
- Hard to remember which document contains what
- Difficult to synthesize information across documents
- Need to prepare lessons quickly

**How NeuraAgent Helps**:
- Upload all teaching materials once
- Select relevant documents for each topic
- Ask natural language questions
- Get instant answers with source references
- Save hours of preparation time

### Secondary Persona: University Lecturer (Dr. Tran)
**Background**:
- University computer science lecturer
- 100+ research papers and course materials
- Teaches multiple courses
- Needs to stay updated with research

**Goals**:
- Organize research papers
- Prepare course content
- Find relevant papers quickly
- Synthesize research findings

**Pain Points**:
- Too many papers to read manually
- Hard to find specific information
- Need to cite sources accurately
- Time-consuming literature review

**How NeuraAgent Helps**:
- Upload all research papers
- Search across entire library
- Get summaries and key findings
- Accurate source citations
- Efficient literature review

---

## User Workflows

### Workflow 1: New User Onboarding

**Steps**:
1. **Discovery**: User visits landing page
   - Reads about document knowledge base feature
   - Checks pricing and features
   - Decides to try

2. **Registration**: User signs up
   - Fills registration form (name, email, password)
   - Receives verification email
   - Clicks verification link
   - Account activated

3. **First Login**: User logs in
   - Sees intro tour (optional)
   - Learns about document upload
   - Learns about document scope selection
   - Learns about credit system

4. **Upload Documents**: User uploads first documents
   - Clicks upload button
   - Selects PDF/DOCX/TXT files
   - Waits for processing (chunking + embedding)
   - Sees documents in sidebar

5. **First Query**: User asks first question
   - Selects relevant documents (scope)
   - Types question in chat input
   - Sees AI processing (streaming response)
   - Gets answer with source references
   - Impressed by accuracy

6. **Regular Usage**: User returns regularly
   - Uploads more documents over time
   - Uses document scope for different topics
   - Prepares lessons efficiently
   - Considers upgrading plan

**UI Components Involved**:
- Landing page (HeroSection, FeaturesSection, PricingSection)
- SignupForm
- Email verification page
- IntroTour
- Dashboard
- FileUploadModal
- SourcesManager
- ChatInterface
- MessageList

### Workflow 2: Daily Lesson Preparation

**Steps**:
1. **Login**: User opens app
   - Auto-login (remembered)
   - Sees dashboard with document library

2. **Select Topic**: User prepares for today's lesson
   - Topic: "Quadratic Equations"
   - Selects relevant documents:
     - Textbook Chapter 5
     - Teaching notes
     - Exercise solutions

3. **Check Credits**: User checks credit balance
   - Sees balance in FloatingCreditIndicator
   - Sufficient credits available

4. **Ask Questions**: User queries knowledge base
   - Q1: "What are common student mistakes with quadratic equations?"
   - AI searches selected documents
   - Gets comprehensive answer with examples
   - Copies useful content for lesson plan

5. **Follow-up Questions**: User asks more questions
   - Q2: "Show me practice problems from these documents"
   - AI retrieves relevant exercises
   - Q3: "What teaching strategies are recommended?"
   - Gets pedagogical advice from teaching notes

6. **Finish Session**: User completes preparation
   - Satisfied with answers
   - Lesson plan ready
   - Logs out
   - Returns tomorrow

**UI Components Involved**:
- Dashboard
- SourcesManager (document selection)
- FloatingCreditIndicator
- ChatInterface
- MessageList (with markdown rendering)
- MessageInput

### Workflow 3: Managing Large Document Library

**Steps**:
1. **Organize Documents**: User has 80+ documents
   - Groups by subject and topic
   - Tags documents for easy finding

2. **Targeted Search**: User prepares unit on "Trigonometry"
   - Selects only trigonometry-related documents (10 files)
   - Excludes other math topics

3. **Comprehensive Query**: User asks broad question
   - "Create a summary of all trigonometry concepts covered"
   - AI analyzes all 10 selected documents
   - Generates comprehensive overview
   - Includes page references

4. **Refine Scope**: User narrows focus
   - Selects 3 specific documents
   - Asks detailed questions
   - Gets precise answers
   - Builds complete lesson plan

5. **Upgrade Decision**: User hits document limit
   - Sees value in larger knowledge base
   - Compares subscription plans
   - Upgrades to Premium plan
   - Continues uploading more materials

**UI Components Involved**:
- SourcesManager (with document selection checkboxes)
- ChatInterface
- Settings page (subscription management)
- PricingSection (plan comparison)

### Workflow 4: Credit Management

**Steps**:
1. **Monitor Usage**: User checks credit balance
   - Sees balance in FloatingCreditIndicator
   - Clicks to see detailed breakdown

2. **Low Credit Warning**: User receives warning
   - Balance below 20%
   - Warning message displayed
   - Options: wait for monthly reset or purchase credits

3. **Purchase Credits**: User decides to buy credits
   - Goes to Settings > Credits tab
   - Selects credit package
   - Enters payment info
   - Completes purchase
   - Credits added instantly

4. **View History**: User checks usage history
   - Sees all transactions
   - Understands credit consumption
   - Plans future usage

**UI Components Involved**:
- FloatingCreditIndicator
- Settings page (Credits tab)
- CreditBalance component
- Payment modal (future)

---

## Key Features

### 1. Landing Page
**Purpose**: Convert visitors to users

**Sections**:
- **Hero**: Clear value proposition + CTA
- **Features**: 6 key features with icons
- **How It Works**: 3-step process
- **Pricing**: Transparent pricing with plan comparison
- **Credit Usage**: Clear explanation of credit costs
- **Developers**: API documentation preview
- **Security**: Trust indicators
- **CTA**: Multiple conversion points

**Components**:
- LandingNav
- HeroSection
- FeaturesSection
- HowItWorksSection
- PricingSection
- CreditUsageSection
- DevelopersSection
- SecuritySection
- CTASection
- Footer

### 2. Authentication
**Purpose**: Secure access to platform

**Features**:
- Email/password registration
- Email verification
- OAuth2 Google login (future)
- Password reset flow
- Remember me option
- Secure logout

**Components**:
- LoginForm
- SignupForm
- ForgotPassword
- OAuthCallback (future)

### 3. Dashboard (Main Interface)
**Purpose**: Main interaction point with AI

**Features**:
- Real-time chat with streaming responses
- Document library in sidebar
- Document scope selection (checkboxes)
- Credit balance indicator
- Conversation history
- Clear conversation option
- Markdown and code syntax highlighting
- Math equation rendering (KaTeX)

**Components**:
- Dashboard (container)
- ChatInterface
- MessageList
- MessageInput
- SourcesManager
- FloatingCreditIndicator
- IntroTour

### 4. Document Management
**Purpose**: Upload and organize teaching materials

**Features**:
- Drag-and-drop upload
- Supported formats: PDF, DOCX, TXT
- File size limit: 10MB per document
- Document list with selection checkboxes
- Delete documents
- Search within selected document scope
- Multiple document selection for queries

**Components**:
- FileUploadModal
- SourcesManager

### 5. Settings
**Purpose**: Manage account and preferences

**Tabs**:
- **Profile**: Name, email, phone, password
- **Credits**: Balance, history, purchase
- **Preferences**: Language, notifications
- **Subscription**: Current plan, upgrade/downgrade

**Components**:
- Settings (container)
- ProfileTab
- CreditsTab
- PreferencesTab
- SubscriptionTab

---

## Business Rules

### Document Upload
- Maximum file size: 10MB per document
- Supported formats: PDF, DOCX, TXT
- Cost: 10 credits per document
- Processing time: ~30 seconds per 10MB
- Storage limits per plan:
  - Free: 100MB (10 documents)
  - Basic: 500MB (50 documents)
  - Premium: 2GB (200 documents)
  - Enterprise: 10GB (unlimited documents)

### Credit System
- Credits never expire (purchased credits)
- Subscription credits reset monthly
- Unused subscription credits don't roll over
- Purchased credits used first
- Minimum purchase: 100 credits
- Credit costs:
  - Basic Chat: 1 credit
  - Advanced Chat: 5 credits
  - Document Upload: 10 credits
  - Semantic Search: 2 credits
  - Document Summary: 5 credits

### Rate Limiting
Per subscription plan:
- **Free**: 10 req/min, 100 req/hour, 500 req/day
- **Basic**: 30 req/min, 500 req/hour, 2000 req/day
- **Premium**: 60 req/min, 1500 req/hour, 10000 req/day
- **Enterprise**: Unlimited

### Subscription
- Monthly billing cycle
- Auto-renewal by default
- Can cancel anytime (access until end of period)
- Upgrade takes effect immediately
- Downgrade takes effect next billing cycle
- Refund policy: 7 days for new subscriptions

---

## User Interface Patterns

### Loading States
- Show spinner during API calls
- Show progress bar during file upload
- Show "AI is thinking..." during chat processing
- Disable buttons during submission

### Error States
- Show user-friendly error messages
- Provide recovery actions (retry, go back)
- Log errors to console (dev) or error tracking (prod)
- Never show technical error details to users

### Success States
- Show success message after actions
- Auto-dismiss after 3 seconds
- Provide next action suggestions

### Empty States
- Show helpful message when no data
- Provide action to add data
- Show examples or tutorials

---

## Internationalization (i18n)

### Supported Languages
- Vietnamese (default)
- English

### Translation Keys
All UI text uses translation keys:
```typescript
t('landing.hero.title')
t('auth.login.button')
t('dashboard.chat.placeholder')
t('settings.profile.title')
```

### Language Switching
- Language switcher in navigation
- Persists across sessions (localStorage)
- Applies to all UI elements
- Does not affect AI responses (AI responds in query language)

---

## Accessibility

### Keyboard Navigation
- All interactive elements keyboard accessible
- Tab order follows visual order
- Escape key closes modals
- Enter key submits forms

### Screen Readers
- Semantic HTML elements
- ARIA labels for icons
- Alt text for images
- Descriptive link text

### Visual
- Sufficient color contrast (WCAG AA)
- Focus indicators visible
- Text resizable up to 200%
- No content flashing

---

## Performance Targets

### Loading
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s

### Bundle Size
- Total bundle: < 500KB (gzipped)
- Initial load: < 200KB
- Code splitting for routes

### Runtime
- Smooth scrolling (60fps)
- Instant UI feedback (< 100ms)
- Streaming response (chunks every 50ms)

---

## Security Considerations

### Authentication
- JWT tokens with 24h expiration
- Secure token storage (localStorage)
- Automatic logout on token expiration
- HTTPS only in production

### Data Protection
- No sensitive data in localStorage (except token)
- Input validation on all forms
- XSS protection (React built-in)
- CSRF protection for state-changing operations

### File Upload
- File type validation (whitelist)
- File size validation (max 10MB)
- Virus scanning (backend)
- Secure file storage (S3 with encryption)

---

## Analytics & Tracking

### User Events
- Page views
- Sign up / Login
- Document upload
- Chat message sent
- Credit purchase
- Subscription upgrade/downgrade

### Performance Metrics
- Page load times
- API response times
- WebSocket connection success rate
- Error rates

### Business Metrics
- Daily/Monthly Active Users
- Conversion rate (visitor → signup)
- Activation rate (signup → first document)
- Retention rate (7-day, 30-day)
- Churn rate
- Average Revenue Per User (ARPU)

---

## Common User Questions

**Q: How many documents can I upload?**
A: Depends on your plan. Free: 10 documents, Basic: 50, Premium: 200, Enterprise: unlimited.

**Q: What file formats are supported?**
A: PDF, DOCX, and TXT files up to 10MB each.

**Q: How does document scope selection work?**
A: Select specific documents before asking questions. AI will only search within selected documents for more accurate answers.

**Q: What happens when I run out of credits?**
A: You can wait for monthly reset (subscription credits) or purchase additional credits.

**Q: Can I cancel my subscription?**
A: Yes, anytime. You'll keep access until the end of your billing period.

**Q: Are my documents private?**
A: Yes, your documents are only accessible to you and are encrypted at rest.

**Q: Can I export my chat history?**
A: Yes, you can export conversations to PDF (future feature).

**Q: How accurate are the AI answers?**
A: AI provides answers based on your uploaded documents with source references. Always verify important information.

---

## Future Features

### Short-term (Q2 2025)
- [ ] Document folders and organization
- [ ] Document tagging system
- [ ] Advanced search filters
- [ ] Conversation history with document context
- [ ] Export conversation to PDF
- [ ] Dark mode

### Mid-term (Q3-Q4 2025)
- [ ] Mobile apps (iOS, Android)
- [ ] Browser extension
- [ ] Desktop app (Electron)
- [ ] Shared document libraries (team collaboration)
- [ ] Document version control
- [ ] Custom AI personalities

### Long-term (2026+)
- [ ] Multi-modal AI (images, audio, video)
- [ ] Live document editing with AI
- [ ] Integration with LMS platforms
- [ ] API for third-party developers
- [ ] White-label solution

---

**Last Updated**: 2025-02-27  
**Version**: 1.0
