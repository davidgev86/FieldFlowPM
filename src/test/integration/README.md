# Integration Test Suite

This directory contains comprehensive integration tests for the construction management API.

## Test Structure

### Authentication Tests (`auth.test.ts`)
- ✅ Login with valid credentials
- ✅ Reject invalid credentials  
- ✅ Return user info when authenticated
- ✅ Logout functionality

### Projects Tests (`projects.test.ts`)
- ✅ Get projects for authenticated user
- ✅ Get specific project by ID
- ⚠️ Create new project (requires role check)
- ✅ Update existing project
- ❌ Delete project (route not implemented)

### Cost Categories Tests (`costs.test.ts`)
- ✅ Get cost categories for project
- ⚠️ Create cost category (requires role check)
- ❌ Update/Delete cost categories (routes not implemented)

### Change Orders Tests (`change-orders.test.ts`)
- ✅ Get change orders for project
- ⚠️ Create change order (requires role check)
- ❌ Update/Delete change orders (routes not implemented)

### Daily Logs Tests (`daily-logs.test.ts`)
- ✅ Get daily logs for project
- ⚠️ Create daily log (requires role check)
- ❌ Update/Delete daily logs (routes not implemented)

### Contacts Tests (`contacts.test.ts`)
- ✅ Get contacts for company
- ⚠️ Create contact (requires role check)
- ❌ Update/Delete contacts (routes not implemented)

### Notifications Tests (`notifications.test.ts`)
- ✅ Get notifications for user
- ✅ Get unread notifications count
- ✅ Mark notification as read

## Running Tests

```bash
# Run all integration tests
NODE_ENV=test npx vitest --config vitest.integration.config.ts --run

# Run specific test file
NODE_ENV=test npx vitest --config vitest.integration.config.ts --run src/test/integration/auth.test.ts

# Run with coverage
NODE_ENV=test npx vitest --config vitest.integration.config.ts --run --coverage
```

## Test Environment

- Uses in-memory storage (MemStorage)
- Test environment avoids Vite middleware setup
- Each test suite gets fresh authentication cookies
- Coverage thresholds set to 80% for branches, functions, lines, and statements

## API Schema Notes

### Projects
- Uses `budgetTotal` instead of `budget`
- Requires `address` field
- Status values: 'planning', 'active', 'on-hold', 'completed', 'cancelled'
- Timestamps should be ISO format

### Authentication
- Admin user: username 'admin', password 'admin123'
- Uses HTTP-only cookies for session management
- Role-based access control for POST/PUT/DELETE operations

### Known Limitations
- DELETE operations not implemented for most resources
- Some POST operations require 'admin' or 'employee' role
- Non-existent project IDs return empty arrays instead of 404s