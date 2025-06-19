# Code Style Guide

This document outlines the code style and formatting conventions for FieldFlowPM. Following these guidelines ensures consistent, readable, and maintainable code across the project.

## 🔧 Automated Tools

The project uses automated tools to enforce consistent code style:

- **ESLint** - Identifies and fixes code quality issues
- **Prettier** - Formats code consistently
- **Husky** - Git hooks for pre-commit and pre-push checks
- **lint-staged** - Runs linting/formatting only on staged files

## 📝 Code Formatting

### General Rules

- **Line Length**: 90 characters maximum (configurable in Prettier)
- **Indentation**: 2 spaces (no tabs)
- **Semicolons**: Always required
- **Quotes**: Single quotes for strings, double quotes in JSX attributes
- **Trailing Commas**: ES5 style (objects, arrays, function parameters)

### Examples

```typescript
// ✅ Good
const projectData = {
  name: 'Kitchen Remodel',
  budget: 50000,
  status: 'active',
};

// ❌ Bad
const projectData = {
    name: "Kitchen Remodel",
    budget: 50000,
    status: "active"
}
```

## 📁 File Organization

### Naming Conventions

- **Files**: kebab-case for regular files, PascalCase for React components
- **Variables**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Functions**: camelCase

```typescript
// ✅ Good
const API_BASE_URL = 'https://api.example.com';
const projectManager = new ProjectManager();
type ProjectStatus = 'active' | 'completed' | 'paused';
interface UserProfile {
  id: number;
  name: string;
}

// ❌ Bad
const api_base_url = 'https://api.example.com';
const ProjectManager = new projectManager();
type project_status = 'active' | 'completed' | 'paused';
```

### Import Organization

Imports are automatically organized by ESLint in this order:

1. Node.js built-in modules
2. External libraries
3. Internal modules (absolute imports)
4. Relative imports

```typescript
// ✅ Good - Auto-organized by ESLint
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../types';
```

## ⚛️ React Conventions

### Component Structure

```typescript
// ✅ Good component structure
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onUpdate?: (project: Project) => void;
}

export function ProjectCard({ project, onUpdate }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      // Update logic here
      onUpdate?.(project);
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <Button onClick={handleUpdate} disabled={isLoading}>
        Update Project
      </Button>
    </div>
  );
}
```

### Hooks Rules

- Use React hooks at the top level only
- Custom hooks must start with 'use'
- Include dependencies in useEffect dependency arrays

```typescript
// ✅ Good
function useProjectData(projectId: number) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject(projectId).then(setProject).finally(() => setLoading(false));
  }, [projectId]);

  return { project, loading };
}
```

## 🎯 TypeScript Guidelines

### Type Definitions

- Use interfaces for object shapes
- Use type aliases for unions, primitives, and computed types
- Prefer explicit return types for public functions

```typescript
// ✅ Good
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

type ProjectStatus = 'planning' | 'active' | 'completed' | 'cancelled';

async function fetchProject(id: number): Promise<Project | null> {
  // Implementation
}
```

### Error Handling

- Use proper error types
- Include error boundaries for React components
- Log errors appropriately

```typescript
// ✅ Good
import { AppError } from '@/utils/errors';

async function updateProject(id: number, data: UpdateProjectData): Promise<Project> {
  try {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new AppError(`Failed to update project: ${error.message}`, error.status);
    }
    throw new AppError('An unexpected error occurred');
  }
}
```

## 🗄️ Database & API

### Naming Conventions

- **Database tables**: snake_case
- **API endpoints**: kebab-case
- **JSON fields**: camelCase

```typescript
// ✅ Good
// Database schema
export const projectTasks = pgTable('project_tasks', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull(),
  taskName: text('task_name').notNull(),
});

// API endpoint
app.get('/api/projects/:id/cost-categories', handler);

// JSON response
{
  "projectId": 123,
  "costCategories": [
    {
      "id": 1,
      "categoryName": "Materials",
      "budgetAmount": 25000
    }
  ]
}
```

## 📝 Documentation

### JSDoc Comments

Use JSDoc for public functions and complex logic:

```typescript
/**
 * Calculates the total budget utilization for a project
 * @param project - The project to analyze
 * @param includeChangeOrders - Whether to include approved change orders
 * @returns Budget utilization as a percentage (0-100)
 */
function calculateBudgetUtilization(
  project: Project,
  includeChangeOrders = true
): number {
  // Implementation
}
```

### README Updates

- Update documentation when adding new features
- Include setup instructions for new dependencies
- Provide examples for complex functionality

## 🚀 Performance Guidelines

### React Optimization

```typescript
// ✅ Good - Memoize expensive calculations
const projectStats = useMemo(() => {
  return calculateProjectStatistics(projects);
}, [projects]);

// ✅ Good - Memoize callbacks
const handleProjectUpdate = useCallback((id: number, data: UpdateData) => {
  updateProject(id, data);
}, [updateProject]);
```

### Database Queries

```typescript
// ✅ Good - Efficient database queries
const projects = await db
  .select()
  .from(projectsTable)
  .where(eq(projectsTable.companyId, companyId))
  .limit(20);
```

## 🔒 Security Guidelines

- Validate all inputs using Zod schemas
- Use parameterized queries for database operations
- Sanitize user-generated content
- Never expose sensitive data in client-side code

```typescript
// ✅ Good - Input validation
const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  budget: z.number().positive(),
  clientId: z.number().int().positive(),
});

app.post('/api/projects', validateBody(createProjectSchema), async (req, res) => {
  // Safe to use req.body here
});
```

## 🛠️ Running Code Quality Checks

### Manual Checks

```bash
# Check TypeScript compilation
npm run type-check

# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Check Prettier formatting
npm run format:check

# Format all files
npm run format

# Run all checks
./scripts/check-code-quality.sh
```

### Automated Checks

The project automatically runs checks on:

- **Pre-commit**: ESLint + Prettier on staged files
- **Pre-push**: TypeScript compilation + tests
- **CI/CD**: Full test suite + linting

### Editor Setup

Install recommended VS Code extensions:

1. ESLint
2. Prettier
3. Tailwind CSS IntelliSense
4. TypeScript Importer

The project includes VS Code settings for automatic formatting and error highlighting.

## 🐛 Common Issues & Solutions

### ESLint Errors

```bash
# Fix auto-fixable issues
npm run lint:fix

# Disable specific rules (use sparingly)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response;
```

### Prettier Conflicts

```bash
# Check if Prettier and ESLint configs conflict
npm run lint
npm run format:check

# Verify .prettierrc and eslint extends include 'prettier'
```

### Import Resolution

```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run type-check

# Check tsconfig.json paths are correct
```

## 📋 Checklist

Before committing code, ensure:

- [ ] Code compiles without TypeScript errors
- [ ] ESLint passes without warnings
- [ ] Prettier formatting is applied
- [ ] Tests pass
- [ ] New functions have appropriate JSDoc comments
- [ ] Error handling is implemented
- [ ] Security considerations are addressed

Following these guidelines helps maintain high code quality and makes the codebase more maintainable for all contributors.