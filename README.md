# FieldFlowPM - Construction Project Management

A responsive web application designed for small construction contractors working in the field. Built with TypeScript, React, and Node.js.

## Features

### Core Modules
- **Project Dashboard** - Real-time overview with project statistics and quick actions
- **Project Management** - Create, track, and manage construction projects
- **Interactive Scheduling** - Drag-and-drop Gantt charts and calendar views
- **Job Cost Tracking** - Budget vs actual cost analysis with QuickBooks sync hooks
- **Change Order Workflow** - Client approval system with e-signature placeholders
- **Daily Log Entries** - Weather tracking, crew management, and progress notes
- **Document Management** - File uploads with categorization and version control
- **Client Portal** - Read-only access for clients to view project status and financials
- **Contact Management** - Organize clients, subcontractors, and vendors

### User Roles
- **Admin** - Full system access and company management
- **Employee** - Project management and field operations
- **Subcontractor** - Limited access to assigned projects
- **Client** - Read-only portal access for their projects

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based with bcrypt
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI with custom styling
- **Icons**: Lucide React
- **Deployment**: Replit (configured)

## Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn package manager

## Installation & Setup

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with the following variables:
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/fieldflowpm
   NODE_ENV=development
   ```

3. **Database Setup**
   ```bash
   # Push schema to database
   npm run db:push
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## Demo Credentials

- **Admin Access**: username: `admin`, password: `admin123`
- **Client Access**: username: `maria.johnson`, password: `client123`

## Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route-based page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Node.js backend API
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database operations
│   └── vite.ts           # Development server setup
├── shared/               # Shared TypeScript types and schemas
└── components.json       # Shadcn/ui configuration
```

## Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build production assets
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List projects (filtered by user role)
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project

### Additional endpoints available for tasks, costs, change orders, daily logs, documents, and contacts.

## Database Schema

The application uses Drizzle ORM with PostgreSQL. Key tables include:
- `users` - User accounts and authentication
- `companies` - Construction companies
- `projects` - Construction projects
- `project_tasks` - Project scheduling and tasks
- `cost_categories` - Budget tracking
- `change_orders` - Change request workflow
- `daily_logs` - Field progress tracking
- `documents` - File management
- `contacts` - Client and vendor information

## Deployment

### Replit Deployment
The project is configured for Replit deployment with the included `.replit` file. Simply:
1. Push to your Replit project
2. Ensure environment variables are set
3. Run the application

### Other Platforms
For deployment to other platforms:
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Start the server: `npm start`

## Development Guidelines

- Use TypeScript for all new code
- Follow existing component patterns in `client/src/components`
- API routes should use Zod for input validation
- Database operations go through the storage interface in `server/storage.ts`
- Shared types belong in `shared/schema.ts`

## QuickBooks Integration

Placeholder hooks are included for QuickBooks sync in the cost tracking module. Integration points:
- Cost import/export functionality
- Budget vs actual reporting
- Invoice generation workflows

## Contributing

1. Follow the existing code style and patterns
2. Add appropriate TypeScript types
3. Test changes locally before submitting
4. Update documentation for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the development team or open an issue in the project repository.