# FieldFlowPM API Documentation

## Authentication

All API endpoints (except login) require authentication via session-based auth.

### POST /api/auth/login
Login with username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "companyId": 1,
    "phone": "+1234567890",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "sessionId": "session-uuid"
}
```

### POST /api/auth/logout
Logout current user.

### GET /api/auth/me
Get current authenticated user details.

## Projects

### GET /api/projects
List projects accessible to the current user.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Kitchen Remodel - Johnson Residence",
    "description": "Complete kitchen renovation",
    "address": "123 Main St, Springfield",
    "status": "active",
    "companyId": 1,
    "clientId": 2,
    "budgetTotal": "45000.00",
    "startDate": "2024-01-15T00:00:00.000Z",
    "dueDate": "2024-03-15T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/projects/:id
Get specific project details.

### POST /api/projects
Create new project (admin/employee only).

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "address": "string",
  "clientId": 1,
  "budgetTotal": "45000.00",
  "startDate": "2024-01-15T00:00:00.000Z",
  "dueDate": "2024-03-15T00:00:00.000Z"
}
```

### PUT /api/projects/:id
Update project (admin/employee only).

## Project Tasks

### GET /api/projects/:projectId/tasks
List tasks for a specific project.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Demolition Phase",
    "description": "Remove existing cabinets and fixtures",
    "projectId": 1,
    "status": "completed",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "assignedTo": 1,
    "duration": 5,
    "dependencies": [],
    "category": "demolition",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/projects/:projectId/tasks
Create new task.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-01-20T00:00:00.000Z",
  "assignedTo": 1,
  "category": "string"
}
```

## Cost Tracking

### GET /api/projects/:projectId/costs
Get cost categories for a project.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Materials",
    "projectId": 1,
    "category": "materials",
    "budgetAmount": "25000.00",
    "actualAmount": "23500.00"
  }
]
```

### POST /api/projects/:projectId/costs
Create new cost category.

## Change Orders

### GET /api/projects/:projectId/change-orders
List change orders for a project.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Additional Electrical Outlets",
    "description": "Add 4 additional outlets in kitchen",
    "projectId": 1,
    "amount": "1200.00",
    "status": "pending",
    "createdBy": 1,
    "approvedBy": null,
    "approvedAt": null,
    "signedAt": null,
    "createdAt": "2024-01-10T00:00:00.000Z"
  }
]
```

### POST /api/projects/:projectId/change-orders
Create new change order.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "amount": "1200.00"
}
```

### PUT /api/projects/:projectId/change-orders/:id/approve
Approve change order (client role required).

## Daily Logs

### GET /api/projects/:projectId/daily-logs
Get daily logs for a project.

**Response:**
```json
[
  {
    "id": 1,
    "projectId": 1,
    "date": "2024-01-15T00:00:00.000Z",
    "weather": "Sunny, 72°F",
    "temperature": "72",
    "crew": ["John Smith", "Mike Johnson"],
    "notes": "Completed demolition of existing cabinets",
    "createdBy": 1,
    "createdAt": "2024-01-15T18:00:00.000Z"
  }
]
```

### POST /api/projects/:projectId/daily-logs
Create daily log entry.

**Request Body:**
```json
{
  "date": "2024-01-15T00:00:00.000Z",
  "weather": "Sunny, 72°F",
  "temperature": "72",
  "crew": ["John Smith", "Mike Johnson"],
  "notes": "Work completed today"
}
```

## Documents

### GET /api/projects/:projectId/documents
List documents for a project.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Building Permit",
    "originalName": "permit-2024-001.pdf",
    "projectId": 1,
    "category": "permits",
    "filePath": "/uploads/documents/permit-2024-001.pdf",
    "fileSize": 2048576,
    "mimeType": "application/pdf",
    "uploadedBy": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/projects/:projectId/documents
Upload document (multipart/form-data).

## Contacts

### GET /api/contacts
List contacts for the current user's company.

**Query Parameters:**
- `type` (optional): Filter by contact type (client, subcontractor, vendor)

**Response:**
```json
[
  {
    "id": 1,
    "type": "client",
    "firstName": "Maria",
    "lastName": "Johnson",
    "email": "maria@email.com",
    "phone": "+1234567890",
    "company": "Johnson Family",
    "address": "123 Main St, Springfield",
    "notes": "Prefers email communication",
    "companyId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/contacts
Create new contact.

**Request Body:**
```json
{
  "type": "client",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "address": "string",
  "notes": "string"
}
```

## Notifications

### GET /api/notifications
Get all notifications for current user.

### GET /api/notifications/unread
Get unread notifications count.

**Response:**
```json
{
  "count": 3
}
```

### PUT /api/notifications/:id/read
Mark notification as read.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

### Common Status Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Validation Errors
For validation errors, additional detail is provided:

```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Role-Based Access

### Admin
- Full access to all endpoints
- Can manage users, companies, and all projects

### Employee
- Access to company projects and related data
- Cannot manage users or company settings

### Subcontractor
- Limited access to assigned projects only
- Cannot create or modify projects

### Client
- Read-only access to their own projects
- Can approve change orders
- Access to client portal views only