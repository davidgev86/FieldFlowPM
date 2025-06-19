# FieldFlowPM - Construction Project Management

> A modern, responsive web application designed specifically for small construction contractors managing projects in the field.

FieldFlowPM streamlines project management with real-time collaboration, mobile-friendly interfaces, and integrated workflows that keep your construction business organized and profitable.

## 🚀 Features

### Core Project Management
- **Interactive Dashboard** - Real-time project overview with key metrics and quick actions
- **Project Tracking** - Create, manage, and monitor multiple construction projects
- **Smart Scheduling** - Drag-and-drop timeline management with dependency tracking
- **Cost Control** - Budget vs actual analysis with QuickBooks integration hooks
- **Change Orders** - Streamlined approval workflow with e-signature capabilities
- **Daily Logs** - Weather, crew, and progress tracking with photo uploads
- **Document Hub** - Centralized file management with version control
- **Client Portal** - Read-only project access for clients with real-time updates
- **Contact Manager** - Organize clients, subcontractors, and vendors

### Mobile-First Design
- **Responsive Interface** - Works seamlessly on phones, tablets, and desktops
- **Offline Capabilities** - Continue working when connectivity is limited
- **Touch-Friendly** - Optimized for field use with gloves and various conditions

### User Management
- **Admin** - Full system access and company management
- **Employee** - Project management and field operations  
- **Subcontractor** - Limited access to assigned projects
- **Client** - Read-only portal for project monitoring

## 🛠 Tech Stack

**Frontend**
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for fast development
- TanStack Query for state management
- Radix UI components
- Lucide React icons

**Backend**
- Node.js with Express
- TypeScript for type safety
- Drizzle ORM with PostgreSQL
- Session-based authentication
- bcrypt for password security

**Development**
- ESLint & Prettier for code quality
- Vitest for testing
- GitHub Actions for CI/CD

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+** ([Download here](https://nodejs.org/))
- **PostgreSQL 14+** ([Download here](https://www.postgresql.org/download/))
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control

## ⚡ Quick Start

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-org/fieldflowpm.git
cd fieldflowpm

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Required environment variables (see `.env.example` for details):
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Random secret for session encryption
- `NODE_ENV` - Set to 'development' for local work

### 3. Database Setup
```bash
# Create your PostgreSQL database
createdb fieldflowpm

# Push the schema to your database
npm run db:push

# (Optional) Open database studio to view tables
npm run db:studio
```

### 4. Start Development
```bash
# Start both frontend and backend servers
npm run dev
```

🎉 Open http://localhost:5000 in your browser

### 5. Login & Explore
Use these demo credentials to get started:

**Admin Account**
- Username: `admin`
- Password: `admin123`

**Client Account**  
- Username: `maria.johnson`
- Password: `client123`

## 📁 Project Structure

```
fieldflowpm/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Base UI components (buttons, forms, etc.)
│   │   │   ├── layout/       # Layout components (sidebar, header)
│   │   │   └── project/      # Project-specific components
│   │   ├── pages/            # Route-based page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and configurations
│   │   └── App.tsx           # Main application component
│   └── index.html            # HTML entry point
├── server/                    # Node.js backend API
│   ├── middleware/           # Express middleware
│   ├── utils/                # Server utilities
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Database operations
│   └── vite.ts              # Development server setup
├── shared/                    # Shared TypeScript types and schemas
│   └── schema.ts            # Database schema and validation
├── src/test/                 # Test files
├── .env.example              # Environment variables template
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🛠 Available Scripts

### Development
```bash
npm run dev          # Start development server (frontend + backend)
npm run db:push      # Push database schema changes
npm run db:studio    # Open Drizzle Studio (database GUI)
```

### Code Quality
```bash
npm run lint         # Check code for issues
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted
npm run type-check   # TypeScript type checking
npm run quality      # Run all quality checks
```

### Testing
```bash
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Open test UI
```

### Production
```bash
npm run build        # Build for production
npm start            # Start production server
```

## 🔌 API Reference

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout  
- `GET /api/auth/me` - Get current user profile

### Projects
- `GET /api/projects` - List user's projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project

### Project Data
- `GET /api/projects/:id/tasks` - Project tasks
- `GET /api/projects/:id/costs` - Cost tracking
- `GET /api/projects/:id/change-orders` - Change orders
- `GET /api/projects/:id/daily-logs` - Daily progress logs
- `GET /api/projects/:id/documents` - Project documents

### Contacts
- `GET /api/contacts` - Company contacts
- `POST /api/contacts` - Add new contact

See [API.md](API.md) for complete endpoint documentation.

## 🗄 Database Schema

FieldFlowPM uses PostgreSQL with Drizzle ORM. Key entities:

- **Users** - Authentication and user profiles
- **Companies** - Construction company information  
- **Projects** - Individual construction projects
- **Tasks** - Project scheduling and milestones
- **Costs** - Budget tracking and expense management
- **Change Orders** - Project modification workflow
- **Daily Logs** - Field progress and conditions
- **Documents** - File storage and organization
- **Contacts** - Client and vendor directory

## 🚀 Deployment

### Replit (Recommended)
This project is optimized for Replit deployment:

1. **Import to Replit**
   - Connect your GitHub repository
   - Replit auto-detects the configuration

2. **Set Environment Variables**
   - Go to Secrets tab in Replit
   - Add variables from `.env.example`

3. **Deploy**
   - Click "Run" to start development
   - Use Replit Deployments for production

### Manual Deployment

#### Prerequisites
- Node.js 20+ server
- PostgreSQL database
- Process manager (PM2 recommended)

#### Steps
```bash
# 1. Build the application
npm run build

# 2. Set environment variables
export DATABASE_URL="your-postgres-url"
export NODE_ENV="production"
export SESSION_SECRET="your-secret-key"

# 3. Run database migrations
npm run db:push

# 4. Start the server
npm start

# Or with PM2
pm2 start dist/index.js --name fieldflowpm
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/fieldflowpm

# Security  
SESSION_SECRET=your-super-secret-key-here

# Application
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# Optional integrations
QUICKBOOKS_CLIENT_ID=your-quickbooks-id
QUICKBOOKS_CLIENT_SECRET=your-quickbooks-secret
```

## 🧪 Development Guidelines

### Code Standards
- **TypeScript First** - All new code must use TypeScript
- **Component Patterns** - Follow existing patterns in `client/src/components`
- **API Validation** - Use Zod schemas for request validation
- **Database Operations** - Go through the storage interface
- **Shared Types** - Define in `shared/schema.ts`

### Code Quality
- **ESLint** - Comprehensive linting with TypeScript, React, and accessibility rules
- **Prettier** - Consistent code formatting across the project
- **Pre-commit hooks** - Automatic linting and formatting on git commits
- **Pre-push hooks** - Type checking and tests before pushing

### Best Practices
- Write self-documenting code with clear variable names
- Add JSDoc comments for complex functions
- Use proper error handling with typed errors
- Test critical paths with unit tests
- Keep components small and focused

See [CODE_STYLE.md](CODE_STYLE.md) for detailed style guidelines.

### Adding Features
1. **Plan the data model** - Update `shared/schema.ts`
2. **Backend first** - Add storage methods and API routes
3. **Frontend implementation** - Create components and pages
4. **Test thoroughly** - Add tests and manual verification

## 🔗 Integrations

### QuickBooks (Ready for Setup)
The application includes placeholder hooks for QuickBooks integration:
- Cost import/export functionality
- Budget vs actual reporting  
- Invoice generation workflows

To enable, obtain QuickBooks API credentials and update environment variables.

### Future Integrations
- **Photo Storage** - AWS S3 or Cloudinary
- **Email** - SendGrid or Mailgun for notifications
- **SMS** - Twilio for field alerts
- **Weather** - API integration for daily logs

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b feature/amazing-feature`
3. **Follow code standards** - Run linting and tests
4. **Commit changes** - Use conventional commit messages
5. **Push to branch** - `git push origin feature/amazing-feature`
6. **Open Pull Request** - Include detailed description

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support & Community

- **Documentation** - Check this README and [API.md](API.md)
- **Issues** - Report bugs via GitHub Issues
- **Discussions** - Join GitHub Discussions for questions
- **Email** - Contact the development team

---

**Built with ❤️ for construction professionals who deserve better tools.**