# Frontend Service - Product Document

## Document Information

- **Product Name**: Agent Education Web Application
- **Service**: frontend-service
- **Version**: 1.0.10
- **Last Updated**: 2025-02-24
- **Status**: Production
- **URL**: https://neurosus.com

---

## 1. Product Vision

### 1.1 Mission

Provide teachers with an intuitive, modern web interface to interact with AI-powered educational assistance, enabling them to upload multiple documents as a knowledge base and ask questions within selected document scope for efficient teaching preparation and content understanding.

### 1.2 Value Proposition

- **For Teachers**: Upload all teaching materials and get instant answers from your document knowledge base
- **For Educators**: Quickly find information across multiple documents without manual searching
- **For Institutions**: Improve teaching efficiency and content accessibility

### 1.3 Target Users

**Primary Users**:

- Teachers (K-12, university, training centers)
- Educators preparing lesson plans
- Instructors managing course materials

**Secondary Users**:

- Content creators organizing educational materials
- Administrators managing institutional knowledge
- Researchers working with multiple documents

---

## 2. Product Features

### 2.1 Core Features

#### Landing Page

**Purpose**: Convert visitors to users

**Components**:

- **Hero Section**: Clear value proposition with CTA
- **Features Showcase**: 6 key features with icons
- **How It Works**: 3-step process
- **Pricing Section**: Transparent pricing with plan comparison
- **Credit Usage**: Clear explanation of credit costs
- **Developer Section**: API documentation preview
- **Security Section**: Trust indicators
- **Call-to-Action**: Multiple conversion points

**User Journey**:

```
Visitor lands → Reads features → Checks pricing → Signs up
```

#### AI Chat Interface

**Purpose**: Main interaction point with AI assistant for document-based queries

**Features**:

- Real-time streaming responses
- Markdown and code syntax highlighting
- Math equation rendering (KaTeX)
- Copy message functionality
- Model selection (Gemini, Qwen)
- Credit balance indicator
- Conversation history
- Clear conversation option
- **Document scope selection**: Ask questions within selected documents

**User Experience**:

- ChatGPT-style clean design
- Smooth streaming animation
- Instant feedback
- Mobile-responsive
- Easy document scope management

**User Journey**:

```
Login → Dashboard → Select documents → Type question → AI searches selected docs → Get answer with sources
```

#### Document Management (Knowledge Base)

**Purpose**: Upload and organize teaching materials as a searchable knowledge base

**Features**:

- Drag-and-drop upload
- Supported formats: PDF, DOCX, TXT
- File size limit: 10MB per document
- Document list in sidebar with selection
- Delete documents
- Search within selected document scope
- Multiple document selection for queries
- Document organization and tagging

**User Experience**:

- Simple upload flow
- Visual feedback during processing
- Organized document list
- Quick access from sidebar
- Easy document selection for queries

**User Journey**:

```
Upload documents → Processing → Indexed in knowledge base → Select scope → Ask questions → Get answers from selected documents
```

**Key Use Case - Document Scope**:

```
Teacher uploads 50 documents → Selects 5 documents about "Algebra" → Asks "What are the key concepts?" → AI searches only those 5 documents → Returns relevant answers with source references
```

#### User Authentication

**Purpose**: Secure access to platform

**Features**:

- Email/password registration
- Email verification
- OAuth2 Google login
- Password reset flow
- Remember me option
- Secure logout

**User Experience**:

- Quick registration (< 2 minutes)
- Social login for convenience
- Clear error messages
- Password strength indicator

**User Journey**:

```
Sign up → Verify email → Login → Access dashboard
```

#### Credit System

**Purpose**: Transparent usage tracking

**Features**:

- Real-time balance display
- Usage history
- Low credit warnings
- Subscription management
- Credit purchase option

**User Experience**:

- Always visible balance
- Clear credit costs
- No surprises
- Easy top-up

**User Journey**:

```
Check balance → Use AI → See deduction → Top up when needed
```

### 2.2 Advanced Features

#### Intro Tour

**Purpose**: Onboard new users effectively

**Features**:

- Guided walkthrough
- Highlights key features
- Skippable at any time
- Shows once per user
- Interactive tooltips

**Tour Steps**:

1. Welcome message
2. Chat input location
3. Document upload button
4. Document selection for scope
5. Credit balance indicator
6. Settings menu
7. Start chatting CTA

#### Multi-Language Support

**Purpose**: Serve global audience

**Features**:

- Vietnamese (default)
- English
- Language switcher in nav
- Persists across sessions
- Applies to all UI elements

**Supported Content**:

- All UI text
- Error messages
- Help text
- Email templates

#### Settings Management

**Purpose**: Personalize user experience

**Features**:

- Profile management
- Credit balance and history
- Subscription management
- Language preferences
- Document settings
- Account security

---

## 3. User Experience

### 3.1 User Journeys

#### Journey 1: New Teacher Onboarding

```
Step 1: Discovery
- Teacher visits landing page
- Reads about document knowledge base feature
- Checks pricing
- Decides to try

Step 2: Registration
- Clicks "Get Started"
- Fills registration form
- Receives verification email
- Clicks verification link

Step 3: First Login
- Logs in with credentials
- Sees intro tour
- Learns about document upload and scope selection
- Skips or completes tour

Step 4: Upload Teaching Materials
- Clicks upload button
- Selects multiple PDF files (textbooks, notes, curriculum)
- Waits for processing
- Sees documents in knowledge base

Step 5: First Query with Document Scope
- Selects 3 documents about "Chapter 5"
- Types question: "What are the main concepts in this chapter?"
- AI searches only selected documents
- Gets answer with source references
- Impressed by accuracy and speed

Step 6: Regular Usage
- Uploads more documents over time
- Uses document scope for different topics
- Prepares lessons efficiently
- Considers upgrade for more storage
```

#### Journey 2: Regular Teacher Session

```
Step 1: Login
- Opens website
- Auto-login (remembered)
- Sees dashboard with document library

Step 2: Prepare for Today's Lesson
- Topic: Quadratic Equations
- Selects relevant documents (textbook chapters, teaching notes, exercises)
- Checks credit balance

Step 3: Query Knowledge Base
- Asks: "What are common student mistakes with quadratic equations?"
- AI searches selected documents
- Gets comprehensive answer with examples
- Copies useful content for lesson plan

Step 4: Follow-up Questions
- Asks: "Show me practice problems from these documents"
- AI retrieves relevant exercises
- Asks: "What teaching strategies are recommended?"
- Gets pedagogical advice from teaching notes

Step 5: Finish Session
- Satisfied with preparation
- Logs out
- Returns tomorrow for next lesson
```

#### Journey 3: Managing Large Document Library

```
Step 1: Organize Documents
- Teacher has 80+ documents uploaded
- Groups by subject and topic
- Tags documents for easy finding

Step 2: Targeted Search
- Preparing unit on "Trigonometry"
- Selects only trigonometry-related documents (10 files)
- Excludes other math topics

Step 3: Comprehensive Query
- Asks: "Create a summary of all trigonometry concepts covered"
- AI analyzes all 10 selected documents
- Generates comprehensive overview
- Includes page references

Step 4: Refine Scope
- Narrows to 3 specific documents
- Asks detailed questions
- Gets precise answers
- Builds complete lesson plan

Step 5: Upgrade Decision
- Hits document limit
- Sees value in larger knowledge base
- Upgrades to Premium plan
- Continues uploading more materials
```

### 3.2 Key User Interfaces

#### Landing Page

**Layout**:

- Fixed navigation with logo and CTA
- Full-width hero with gradient background
- Feature cards in 3-column grid
- Pricing cards with hover effects
- Footer with links

**Design Principles**:

- Clean, modern aesthetic
- Generous white space
- Clear visual hierarchy
- Mobile-first responsive
- Fast loading (< 2s)

#### Dashboard (Chat Interface with Document Scope)

**Layout**:

- Collapsible sidebar (left) with document library
- Document selection checkboxes
- Main chat area (center)
- Floating credit indicator (top-right)
- Fixed input area (bottom)
- Selected documents indicator

**Design Principles**:

- ChatGPT-inspired
- Distraction-free
- Focus on conversation
- Clear document scope visibility
- Smooth animations
- Keyboard shortcuts

#### Settings Page

**Layout**:

- Tab navigation (Profile, Credits, Preferences, Documents)
- Form sections with clear labels
- Action buttons at bottom
- Breadcrumb navigation

**Design Principles**:

- Organized by category
- Clear labels
- Inline validation
- Confirmation dialogs
- Undo capability

---

## 4. Business Model Integration

### 4.1 Freemium Strategy

**Free Tier**:

- 100 credits/month
- Basic chat functionality
- 10 document uploads (max 100MB total)
- Document scope selection
- Community support
- Rate limit: 10/min

**Conversion Triggers**:

- Document limit reached (10 documents)
- Low credit warning at 20%
- Upgrade prompt at 0 credits
- Feature comparison on settings
- Success stories from paid users

**Upgrade Path**:

```
Free User → Hits document limit → Sees value → Compares plans → Upgrades to Premium (50 documents)
```

### 4.2 Credit System Visibility

**Always Visible**:

- Floating indicator (top-right)
- Shows: Used / Total
- Color-coded (green → yellow → red)
- Click to see details

**Usage Transparency**:

- Show cost before action
- Confirm high-cost operations
- Display usage history
- Explain credit deductions

**Psychology**:

- Make credits feel valuable
- Show progress, not just remaining
- Celebrate milestones
- Encourage smart usage

### 4.3 Subscription Management

**Plan Comparison**:

- Side-by-side feature comparison
- Highlight differences (document limits, storage)
- Show value proposition
- Clear pricing

**Subscription Tiers**:

- **Free**: 10 documents, 100MB storage, 100 credits/month
- **Basic**: 50 documents, 500MB storage, 500 credits/month
- **Premium**: 200 documents, 2GB storage, 2000 credits/month
- **Enterprise**: Unlimited documents, 10GB storage, 10000 credits/month

**Upgrade Flow**:

1. Click "Upgrade" button
2. Select plan
3. Enter payment info
4. Confirm purchase
5. Instant activation
6. Welcome email

**Downgrade Flow**:

1. Request downgrade
2. Confirm understanding
3. Schedule for next billing
4. Keep current benefits until then
5. Confirmation email

---

## 5. Competitive Advantage

### 5.1 Differentiators

**vs. ChatGPT**:

- ✅ Document-aware with scope selection (upload your materials)
- ✅ Education-focused for teachers
- ✅ Transparent credit pricing
- ✅ Vietnamese language support
- ✅ Multiple document knowledge base
- ❌ Less general knowledge

**vs. Notion AI**:

- ✅ Better semantic search across documents
- ✅ Real-time streaming
- ✅ Document scope selection
- ✅ Cheaper pricing
- ✅ Standalone application
- ❌ No note-taking features

**vs. Google Drive Search**:

- ✅ AI-powered understanding (not just keyword search)
- ✅ Natural language queries
- ✅ Cross-document synthesis
- ✅ Contextual answers with sources
- ❌ Requires document upload (not cloud-native)

**vs. Traditional Document Search**:

- ✅ Semantic understanding
- ✅ Natural language queries
- ✅ Synthesizes information across multiple documents
- ✅ Provides contextual answers
- ✅ Source attribution

### 5.2 Unique Value Propositions

1. **Document Knowledge Base with Scope Selection**
   - Upload all your teaching materials
   - Select specific documents for each query
   - AI understands YOUR materials
   - Contextual answers from YOUR documents
   - Source attribution for verification

2. **Transparent Pricing**
   - Know exactly what you pay
   - No hidden fees
   - Pay-as-you-go option
   - Credits never expire (purchased)

3. **Real-Time Experience**
   - Streaming responses
   - Instant feedback
   - Live status updates
   - Better than polling

4. **Education-Optimized for Teachers**
   - Math equation rendering
   - Code syntax highlighting
   - Academic writing support
   - Citation assistance
   - Lesson planning support

5. **Multi-Language**
   - Vietnamese interface
   - English interface
   - Bilingual support
   - Cultural adaptation

---

## 6. Success Metrics

### 6.1 User Acquisition

**Metrics**:

- Website visitors/month
- Sign-up conversion rate
- Email verification rate
- First document uploaded rate
- Activation rate (uploaded 3+ documents)

**Targets**:

- 5,000 visitors/month (Year 1)
- 8% sign-up conversion (teachers are motivated)
- 85% email verification
- 75% first document upload rate
- 60% activation rate

### 6.2 User Engagement

**Metrics**:

- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- DAU/MAU ratio (stickiness)
- Average queries per user
- Average documents per user
- Average session duration
- Document scope usage rate

**Targets**:

- 500 DAU (Year 1)
- 1,500 WAU (Year 1)
- 5,000 MAU (Year 1)
- 10% DAU/MAU ratio
- 15 queries/user/week
- 25 documents/user
- 20 minutes/session
- 80% use document scope feature

### 6.3 Conversion & Revenue

**Metrics**:

- Free to paid conversion rate
- Average Revenue Per User (ARPU)
- Customer Lifetime Value (LTV)
- Churn rate
- Upgrade rate
- Downgrade rate

**Targets**:

- 15% free to paid conversion (teachers see value faster)
- $20 ARPU
- $240 LTV (12 months)
- < 4% monthly churn
- 20% upgrade rate
- < 2% downgrade rate

### 6.4 User Satisfaction

**Metrics**:

- Net Promoter Score (NPS)
- Customer Satisfaction (CSAT)
- Feature adoption rate (document scope)
- Support ticket volume
- App store rating (future)

**Targets**:

- NPS > 60
- CSAT > 4.6/5
- 85% document scope adoption
- < 3% support tickets
- 4.6+ stars (app store)

### 6.5 Technical Performance

**Metrics**:

- Page load time
- Time to Interactive
- WebSocket connection success rate
- API error rate
- Uptime
- Document processing time

**Targets**:

- < 2s page load
- < 3s time to interactive
- > 99% WebSocket success
- < 0.1% API error rate
- 99.9% uptime
- < 30s document processing (per 10MB)

---

## 7. Product Roadmap

### 7.1 Current Status (Q1 2025)

**Completed Features**:

- ✅ Landing page with pricing
- ✅ User authentication (email + OAuth2)
- ✅ AI chat with streaming
- ✅ Document upload and knowledge base
- ✅ Document scope selection
- ✅ Credit system integration
- ✅ Multi-language support (vi/en)
- ✅ Intro tour for onboarding
- ✅ Settings management
- ✅ Responsive design

**Known Issues**:

- Occasional WebSocket disconnections
- Slow document processing for large files (>5MB)
- Limited file format support

### 7.2 Near-Term (Q2 2025)

**Planned Features**:

- [ ] Document folders and organization
- [ ] Document tagging system
- [ ] Advanced document search and filtering
- [ ] Conversation history with document context
- [ ] Favorite/bookmark messages
- [ ] Export conversation to PDF with sources
- [ ] Batch document upload
- [ ] Document preview before upload
- [ ] Dark mode
- [ ] Keyboard shortcuts

**Improvements**:

- [ ] Faster document processing (parallel processing)
- [ ] Support for more file formats (PPT, Excel, Images with OCR)
- [ ] Better error handling
- [ ] Improved mobile experience
- [ ] Offline mode (PWA)
- [ ] Push notifications for document processing

### 7.3 Mid-Term (Q3-Q4 2025)

**Planned Features**:

- [ ] Mobile apps (iOS, Android)
- [ ] Browser extension for quick document upload
- [ ] Desktop app (Electron)
- [ ] Advanced search filters (by date, document type, topic)
- [ ] Document collections (group related documents)
- [ ] Shared document libraries (team collaboration)
- [ ] Document version control
- [ ] Annotation and highlighting in documents
- [ ] Custom AI personalities for different subjects
- [ ] Progress tracking and analytics

**Improvements**:

- [ ] Performance optimization
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Personalization engine
- [ ] Better document chunking strategies

### 7.4 Long-Term (2026+)

**Vision Features**:

- [ ] Multi-modal AI (images, audio, video in documents)
- [ ] Collaborative document libraries
- [ ] Live document editing with AI assistance
- [ ] Gamification and achievements
- [ ] Learning path recommendations
- [ ] Integration with LMS platforms (Moodle, Canvas)
- [ ] API for third-party developers
- [ ] White-label solution for institutions
- [ ] Document auto-tagging and organization
- [ ] Smart document recommendations

---

## 8. User Feedback & Iteration

### 8.1 Feedback Channels

**In-App Feedback**:

- Feedback button in settings
- Rate conversation feature
- Bug report form
- Feature request form
- Document scope usability feedback

**External Channels**:

- Email support
- Social media
- User surveys
- Teacher interviews
- Beta testing program
- Teacher community forum

### 8.2 Feedback Loop

```
Collect Feedback → Analyze → Prioritize → Implement → Release → Measure → Iterate
```

**Prioritization Criteria**:

1. User impact (how many teachers affected)
2. Business value (revenue impact)
3. Technical feasibility (effort required)
4. Strategic alignment (roadmap fit)

### 8.3 Recent Improvements (Based on Feedback)

**Q4 2024**:

- ✅ Added intro tour (teachers were confused about document scope)
- ✅ Improved credit balance visibility (teachers didn't notice)
- ✅ Added model selection (teachers wanted choice)
- ✅ Enhanced mobile responsiveness (mobile teachers struggled)

**Q1 2025**:

- ✅ Redesigned credit balance card (cleaner, modern)
- ✅ Improved WebSocket reconnection (connection issues)
- ✅ Added document scope selection (most requested feature)
- ✅ Enhanced error messages (clearer guidance)
- ✅ Added document selection checkboxes (easier scope management)

---

## 9. Risk Analysis

### 9.1 User Experience Risks

| Risk                           | Impact | Probability | Mitigation                            |
| ------------------------------ | ------ | ----------- | ------------------------------------- |
| Slow document processing       | High   | Medium      | Optimize backend, parallel processing |
| WebSocket disconnections       | High   | Medium      | Better reconnection logic             |
| Confusing document scope UI    | High   | Low         | User testing, clear instructions      |
| Mobile experience poor         | Medium | Low         | Mobile-first design                   |
| Document limit too restrictive | High   | Medium      | Flexible pricing tiers                |

### 9.2 Business Risks

| Risk                          | Impact | Probability | Mitigation                                    |
| ----------------------------- | ------ | ----------- | --------------------------------------------- |
| Low teacher adoption          | High   | Medium      | Marketing, free tier, teacher testimonials    |
| High churn rate               | High   | Medium      | Improve value, engagement, support            |
| Competitor entry              | Medium | High        | Differentiation, innovation, community        |
| Pricing too high for teachers | High   | Medium      | Market research, teacher-friendly pricing     |
| Document storage costs        | Medium | Medium      | Efficient storage, compression, tiered limits |

### 9.3 Technical Risks

| Risk                         | Impact | Probability | Mitigation                         |
| ---------------------------- | ------ | ----------- | ---------------------------------- |
| Security breach              | High   | Low         | Security audits, encryption        |
| Data loss                    | High   | Low         | Backups, redundancy                |
| Scalability issues           | Medium | Medium      | Load testing, optimization         |
| Browser compatibility        | Low    | Low         | Cross-browser testing              |
| Document processing failures | Medium | Medium      | Robust error handling, retry logic |

---

## 10. Go-to-Market Strategy

### 10.1 Target Segments

**Primary Segment**: K-12 Teachers

- **Size**: 500,000 teachers in Vietnam
- **Acquisition**: Teacher forums, Facebook groups, school partnerships
- **Message**: "Your teaching materials, instantly searchable"

**Secondary Segment**: University Lecturers

- **Size**: 100,000 lecturers in Vietnam
- **Acquisition**: Academic conferences, university partnerships, LinkedIn
- **Message**: "Research papers and course materials, AI-powered"

**Tertiary Segment**: Training Center Instructors

- **Size**: 200,000 instructors
- **Acquisition**: Training center networks, B2B partnerships
- **Message**: "Organize all training materials in one place"

### 10.2 Marketing Channels

**Digital Marketing**:

- SEO (teacher-focused keywords: "teaching materials search", "lesson planning AI")
- Content marketing (blog, tutorials, teacher success stories)
- Social media (Facebook teacher groups, YouTube tutorials)
- Paid ads (Google, Facebook targeting teachers)
- Influencer partnerships (education influencers)

**Community Building**:

- Teacher community forum
- Facebook group for users
- Teacher ambassadors program
- Referral program (invite colleagues)
- User-generated content (success stories)

**Partnerships**:

- Schools and universities
- Teacher training centers
- Educational publishers
- Ministry of Education
- Teacher associations

**Content Strategy**:

- Blog posts: "How to organize teaching materials with AI"
- Video tutorials: "Getting started with document scope"
- Case studies: "How Ms. Nguyen saves 5 hours/week"
- Webinars: "AI for teachers workshop"

### 10.3 Launch Plan

**Phase 1: Soft Launch** (Q1 2025)

- Limited beta access (100 teachers)
- Collect feedback
- Fix critical issues
- Build initial user base
- Gather testimonials

**Phase 2: Public Launch** (Q2 2025)

- Open registration
- Marketing campaign
- Press release
- Teacher influencer outreach
- School partnerships

**Phase 3: Growth** (Q3-Q4 2025)

- Scale marketing
- Add features based on feedback
- Expand team
- B2B partnerships
- Raise funding (if needed)

---

## 11. Conclusion

The Frontend Service is the face of Agent Education platform, providing teachers with an intuitive, modern interface to access AI-powered educational assistance through a document knowledge base with scope selection. With a focus on user experience, transparent pricing, and continuous improvement based on teacher feedback, the product is positioned to become the leading AI document assistant for educators.

**Key Strengths**:

- ✅ Clean, modern interface
- ✅ Real-time streaming experience
- ✅ Document knowledge base with scope selection
- ✅ Transparent credit system
- ✅ Multi-language support
- ✅ Mobile-responsive design
- ✅ Teacher-focused features

**Next Steps**:

1. Continue feature development per roadmap
2. Improve document processing speed
3. Add document organization features
4. Launch mobile apps
5. Build teacher community
6. Expand to more countries

---

**Document Version**: 1.1
**Last Updated**: 2025-02-24
**Status**: Active
**Next Review**: 2025-03-24
