# Neura Frontend Documentation

This directory contains comprehensive documentation for the neura-frontend application, optimized for both human developers and AI agents.

---

## Documentation Structure

### For AI Agents (Kiro)

**Start here**: [`AI_INDEX.md`](./AI_INDEX.md)

This is the entry point for AI agents. It tells Kiro which documents to read and in what order when generating code.

**Core Documents** (Read in order):
1. **[AI_RULES.md](./AI_RULES.md)** - Coding standards and rules
   - TypeScript patterns
   - React component patterns
   - Security rules
   - DO NOT DO list

2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
   - Component hierarchy
   - State management
   - Data flow
   - API integration

3. **[DOMAIN.md](./DOMAIN.md)** - Business domain knowledge
   - User personas
   - User workflows
   - Business rules
   - Key features

### For Human Developers

**Start here**: [`TECHNICAL_SPECIFICATION.md`](./TECHNICAL_SPECIFICATION.md)

This is the comprehensive technical specification covering all aspects of the frontend application.

**Additional Documents**:
- **[PRODUCT_DOCUMENT.md](./PRODUCT_DOCUMENT.md)** - Product requirements and vision
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture (also useful for humans)
- **[DOMAIN.md](./DOMAIN.md)** - Business domain (also useful for humans)

---

## Quick Navigation

### By Role

**AI Agent (Kiro)**:
```
AI_INDEX.md → AI_RULES.md → ARCHITECTURE.md → DOMAIN.md
```

**New Developer**:
```
README.md (this file) → TECHNICAL_SPECIFICATION.md → ARCHITECTURE.md
```

**Product Manager**:
```
PRODUCT_DOCUMENT.md → DOMAIN.md
```

**Designer**:
```
DOMAIN.md → TECHNICAL_SPECIFICATION.md (Section 3: User Experience)
```

### By Task

**Adding a new feature**:
1. Read DOMAIN.md (understand business context)
2. Read ARCHITECTURE.md (understand system structure)
3. Read AI_RULES.md (follow coding standards)
4. Implement feature
5. Update documentation

**Fixing a bug**:
1. Read ARCHITECTURE.md (understand data flow)
2. Read AI_RULES.md (check for rule violations)
3. Fix bug
4. Add test to prevent regression

**Refactoring code**:
1. Read AI_RULES.md (ensure compliance)
2. Read ARCHITECTURE.md (maintain structure)
3. Refactor
4. Verify tests pass
5. Update documentation

**Onboarding new developer**:
1. Read this README
2. Read TECHNICAL_SPECIFICATION.md
3. Read ARCHITECTURE.md
4. Read AI_RULES.md
5. Set up local environment
6. Run the application

---

## Document Descriptions

### AI_INDEX.md
**Purpose**: Entry point for AI agents  
**Audience**: AI agents (Kiro)  
**Content**: Which documents to read and when  
**Length**: 2 pages  
**Update frequency**: When documentation structure changes

### AI_RULES.md
**Purpose**: Coding standards and rules  
**Audience**: AI agents, developers  
**Content**: 
- Global rules (TypeScript, React, Security)
- Architecture rules
- Code style rules
- DO NOT DO list
**Length**: 8 pages  
**Update frequency**: When coding standards change

### ARCHITECTURE.md
**Purpose**: System architecture and structure  
**Audience**: AI agents, developers, architects  
**Content**:
- High-level architecture
- Component hierarchy
- State management
- Data flow
- API integration
**Length**: 6 pages  
**Update frequency**: When architecture changes

### DOMAIN.md
**Purpose**: Business domain knowledge  
**Audience**: AI agents, developers, product managers  
**Content**:
- Product overview
- User personas
- User workflows
- Business rules
- Key features
**Length**: 8 pages  
**Update frequency**: When business requirements change

### TECHNICAL_SPECIFICATION.md
**Purpose**: Comprehensive technical documentation  
**Audience**: Developers, architects  
**Content**:
- Complete technical details
- API documentation
- Configuration
- Deployment
- Testing
**Length**: 20+ pages  
**Update frequency**: Continuously

### PRODUCT_DOCUMENT.md
**Purpose**: Product requirements and vision  
**Audience**: Product managers, stakeholders  
**Content**:
- Product vision
- User journeys
- Features
- Success metrics
- Roadmap
**Length**: 15+ pages  
**Update frequency**: Quarterly

---

## Documentation Principles

### For AI Agents
1. **Short & Focused**: 2-8 pages per document
2. **Bullet Points**: Easy to scan and parse
3. **Rules > Explanations**: Imperative commands (ALWAYS, NEVER)
4. **DO NOT DO Section**: Clear anti-patterns
5. **Code Examples**: Show, don't tell

### For Humans
1. **Comprehensive**: Cover all aspects
2. **Well-Structured**: Clear sections and hierarchy
3. **Examples**: Real-world scenarios
4. **Visual**: Diagrams and flowcharts
5. **Up-to-Date**: Reflect current state

---

## Maintenance

### When to Update

**AI_RULES.md**:
- New coding pattern adopted
- New security rule added
- New DO NOT DO discovered

**ARCHITECTURE.md**:
- New component added
- State management changed
- New API integration
- Performance optimization

**DOMAIN.md**:
- New feature added
- Business rule changed
- New user workflow
- Pricing changed

**TECHNICAL_SPECIFICATION.md**:
- Any technical change
- New API endpoint
- Configuration change
- Deployment process change

**PRODUCT_DOCUMENT.md**:
- Product vision change
- New feature planned
- Roadmap update
- Success metrics change

### How to Update

1. Make code changes
2. Update relevant documentation
3. Verify documentation accuracy
4. Update "Last Updated" date
5. Commit documentation with code

### Documentation Review

- **Weekly**: Check for outdated information
- **Monthly**: Comprehensive review of all docs
- **Quarterly**: Major update and restructure if needed

---

## Best Practices

### Writing for AI Agents

✅ **DO**:
- Use imperative commands (ALWAYS, NEVER, DO NOT)
- Keep sentences short and clear
- Use bullet points
- Provide code examples
- Be specific and concrete

❌ **DON'T**:
- Use vague language ("usually", "sometimes")
- Write long paragraphs
- Assume context
- Use metaphors or analogies
- Leave room for interpretation

### Writing for Humans

✅ **DO**:
- Explain the "why" behind decisions
- Provide context and background
- Use diagrams and visuals
- Include real-world examples
- Link to external resources

❌ **DON'T**:
- Assume prior knowledge
- Use jargon without explanation
- Skip important details
- Write without structure
- Forget to update

---

## Contributing

### Adding New Documentation

1. Determine audience (AI agent, developer, PM)
2. Choose appropriate format
3. Follow documentation principles
4. Add to this README
5. Update AI_INDEX.md if needed

### Improving Existing Documentation

1. Identify outdated or unclear content
2. Make improvements
3. Update "Last Updated" date
4. Submit for review

### Documentation Standards

- **Format**: Markdown (.md)
- **Line Length**: 80-100 characters (for readability)
- **Code Blocks**: Always specify language
- **Links**: Use relative links for internal docs
- **Headings**: Use proper hierarchy (H1 → H2 → H3)
- **Lists**: Use consistent formatting

---

## Tools

### Documentation Linting
```bash
# Check markdown formatting
npm run format:check

# Check spelling
npm run spell
```

### Documentation Generation
```bash
# Generate API documentation (future)
npm run docs:api

# Generate component documentation (future)
npm run docs:components
```

---

## Resources

### Internal
- [Main README](../README.md) - Project overview
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute (future)
- [Changelog](../CHANGELOG.md) - Version history (future)

### External
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## Feedback

If you find documentation:
- **Unclear**: Open an issue with specific questions
- **Outdated**: Submit a PR with updates
- **Missing**: Request new documentation

**Contact**: dev@neuraagent.com

---

## Version History

| Version | Date       | Changes                          |
|---------|------------|----------------------------------|
| 1.0     | 2025-02-27 | Initial documentation structure  |

---

**Last Updated**: 2025-02-27  
**Maintained by**: NeuraAgent Team  
**Status**: Active
