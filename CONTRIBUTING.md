# Contributing to FieldFlowPM

Thank you for your interest in contributing to FieldFlowPM! This document provides guidelines for contributing to the project.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/fieldflowpm.git
   cd fieldflowpm
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   npm run db:push
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

## Code Standards

### TypeScript
- Use TypeScript for all new code
- Define interfaces in `shared/schema.ts` for cross-cutting types
- Use proper type annotations, avoid `any` when possible
- Leverage Zod schemas for runtime validation

### Code Style
- Run `npm run lint` to check for issues
- Run `npm run format` to auto-format code
- Follow existing patterns in the codebase
- Use meaningful variable and function names

### Component Guidelines

#### Frontend Components
- Keep components small and focused (single responsibility)
- Use the existing UI component library in `client/src/components/ui`
- Place reusable components in `client/src/components`
- Page components go in `client/src/pages`

#### Backend Structure
- API routes in `server/routes.ts`
- Database operations through `server/storage.ts` interface
- Use middleware for cross-cutting concerns
- Validate inputs with Zod schemas

### Database Changes
- Never write raw SQL migrations
- Use `npm run db:push` to sync schema changes
- Update the storage interface when adding new operations
- Test database changes locally before submitting

## Submission Guidelines

### Before Submitting
1. **Test Locally**
   ```bash
   npm run type-check
   npm run lint
   npm run format:check
   ```

2. **Test Core Functionality**
   - Authentication (login/logout)
   - Project creation and viewing
   - Navigation between modules
   - API endpoints respond correctly

### Pull Request Process
1. Create a feature branch from main
2. Make your changes following the guidelines above
3. Test thoroughly locally
4. Submit a pull request with:
   - Clear description of changes
   - Screenshots for UI changes
   - Notes about any breaking changes

### Commit Messages
Use clear, descriptive commit messages:
```
feat: add project budget comparison chart
fix: resolve authentication session timeout
docs: update API documentation
refactor: simplify cost calculation logic
```

## Architecture Guidelines

### Frontend
- Use React Query for server state management
- Keep local state minimal with useState/useContext
- Follow the existing routing patterns with wouter
- Use Tailwind for styling, avoid custom CSS

### Backend
- Keep routes thin, business logic in storage layer
- Use middleware for authentication and validation
- Return consistent JSON responses
- Handle errors gracefully with proper status codes

### Database
- Use Drizzle ORM for all database interactions
- Define relationships clearly in schema
- Use proper indexes for performance-critical queries
- Keep the storage interface clean and typed

## Feature Development

### Adding New Features
1. **Plan the Data Model**
   - Define types in `shared/schema.ts`
   - Add database tables/columns as needed
   - Update storage interface

2. **Backend Implementation**
   - Add API routes with proper validation
   - Implement storage methods
   - Add authentication/authorization checks

3. **Frontend Implementation**
   - Create/update React components
   - Add routing if needed
   - Implement data fetching with React Query
   - Style with Tailwind classes

### Construction Industry Context
- Understand construction project workflows
- Use appropriate terminology (e.g., "change orders" not "change requests")
- Consider field usage scenarios (mobile-friendly, offline-capable when possible)
- Think about compliance and documentation requirements

## Testing

### Current State
- No automated tests are currently implemented
- Manual testing is required for all changes

### Future Testing Goals
- Unit tests for shared utilities and business logic
- Integration tests for API endpoints
- Component tests for critical UI flows
- End-to-end tests for complete user workflows

### Manual Testing Checklist
- [ ] Login/logout flow works
- [ ] All navigation links function
- [ ] Forms submit successfully
- [ ] Data displays correctly
- [ ] Mobile responsive design
- [ ] Error handling works properly

## Getting Help

- Review existing code patterns before implementing new features
- Check the README.md for setup and usage information
- Look at similar components/features for implementation guidance
- Ask questions about architecture decisions before large changes

## Code of Conduct

- Be respectful and constructive in communications
- Focus on the technical merits of contributions
- Help maintain a welcoming environment for all contributors
- Follow professional standards appropriate for business software

Thank you for contributing to FieldFlowPM!