# FieldFlowPM Setup Guide

This guide walks you through setting up FieldFlowPM from scratch, whether you're a developer joining the project or deploying to production.

## 🚀 Quick Setup (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/your-org/fieldflowpm.git
cd fieldflowpm
npm install
```

### 2. Database Setup
```bash
# Start PostgreSQL (if not running)
# macOS with Homebrew:
brew services start postgresql

# Ubuntu/Debian:
sudo systemctl start postgresql

# Create database
createdb fieldflowpm

# Or using psql:
psql -U postgres -c "CREATE DATABASE fieldflowpm;"
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your settings
nano .env
```

**Minimum required variables:**
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/fieldflowpm
SESSION_SECRET=your-32-character-secret-key-here
NODE_ENV=development
```

### 4. Initialize Database
```bash
# Push schema to database
npm run db:push

# Verify tables were created
npm run db:studio
```

### 5. Start Development
```bash
npm run dev
```

Visit http://localhost:5000 and login with:
- Username: `admin`
- Password: `admin123`

## 🔧 Detailed Setup

### Prerequisites

#### Node.js 20+
```bash
# Check version
node --version

# Install via nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

#### PostgreSQL 14+
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from: https://www.postgresql.org/download/windows/
```

#### Git
```bash
# Check if installed
git --version

# Install if needed
# macOS: Already included with Xcode
# Ubuntu: sudo apt install git
# Windows: https://git-scm.com/download/win
```

### Environment Variables Deep Dive

#### Required Variables

**DATABASE_URL**
```bash
# Local development
DATABASE_URL=postgresql://username:password@localhost:5432/fieldflowpm

# Production example
DATABASE_URL=postgresql://user:pass@db.example.com:5432/fieldflowpm_prod

# With SSL (production)
DATABASE_URL=postgresql://user:pass@db.example.com:5432/fieldflowpm_prod?sslmode=require
```

**SESSION_SECRET**
```bash
# Generate a secure secret
openssl rand -base64 32

# Example output (use your own!)
SESSION_SECRET=xK8mN5pQ2vW9yB4eH7jL0oR3sT6uA1dF9gI2kM5nP8q
```

#### Optional Integrations

**QuickBooks Integration**
1. Go to [Intuit Developer](https://developer.intuit.com/)
2. Create an app and get credentials
3. Add to .env:
```bash
QUICKBOOKS_CLIENT_ID=your_client_id
QUICKBOOKS_CLIENT_SECRET=your_client_secret
QUICKBOOKS_SANDBOX=true  # false for production
```

**Twilio SMS**
1. Sign up at [Twilio](https://console.twilio.com/)
2. Get Account SID, Auth Token, and phone number
3. Add to .env:
```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Database Migration

#### Initial Setup
```bash
# Push current schema
npm run db:push

# Open database studio
npm run db:studio
```

#### Schema Changes
```bash
# After modifying shared/schema.ts
npm run db:push

# Review changes in studio
npm run db:studio
```

#### Backup & Restore
```bash
# Backup
pg_dump fieldflowpm > backup.sql

# Restore
psql fieldflowpm < backup.sql
```

### Development Workflow

#### Code Quality
```bash
# Check for issues
npm run lint
npm run type-check

# Auto-fix what's possible
npm run lint:fix
npm run format
```

#### Testing
```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run specific test file
npm test auth.test.ts
```

#### Database Operations
```bash
# View current schema
npm run db:studio

# Reset database (caution!)
dropdb fieldflowpm
createdb fieldflowpm
npm run db:push
```

## 🚀 Production Deployment

### Environment Preparation

#### Production .env
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/fieldflowpm
SESSION_SECRET=your-production-secret-64-chars-minimum
PORT=5000
HOST=0.0.0.0
FORCE_HTTPS=true
COOKIE_SECURE=true
TRUST_PROXY=true
```

#### Build Application
```bash
# Install production dependencies
npm ci --production

# Build application
npm run build

# Verify build
ls -la dist/
```

### Deployment Options

#### Option 1: Replit (Recommended)
1. Import repository to Replit
2. Set environment variables in Secrets
3. Application runs automatically

#### Option 2: VPS/Cloud Server
```bash
# Install PM2 process manager
npm install -g pm2

# Start application
pm2 start dist/index.js --name fieldflowpm

# Set up auto-restart
pm2 startup
pm2 save
```

#### Option 3: Docker
```dockerfile
# Create Dockerfile (not included)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist/ ./dist/
EXPOSE 5000
CMD ["npm", "start"]
```

### SSL/HTTPS Setup

#### Using Nginx (Recommended)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🛠 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Error: password authentication failed
# Fix: Check username/password in DATABASE_URL

# Error: database "fieldflowpm" does not exist
createdb fieldflowpm

# Error: permission denied
# Fix: Grant privileges to user
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE fieldflowpm TO username;"
```

#### Port Conflicts
```bash
# Error: EADDRINUSE :::5000
# Fix: Change port in .env
PORT=3000

# Or kill process using port
lsof -ti:5000 | xargs kill -9
```

#### Session Issues
```bash
# Error: session store not working
# Fix: Ensure SESSION_SECRET is set and long enough

# Error: sessions not persisting
# Fix: Check that cookies are enabled and HTTPS in production
```

#### Build Errors
```bash
# Error: TypeScript compilation failed
npm run type-check

# Error: Module not found
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

#### Database
```sql
-- Add indexes for common queries
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_daily_logs_project_date ON daily_logs(project_id, date);
CREATE INDEX idx_users_username ON users(username);
```

#### Application
```bash
# Enable gzip compression
# Add to your reverse proxy config

# Use production build
NODE_ENV=production npm start
```

### Monitoring

#### Logs
```bash
# PM2 logs
pm2 logs fieldflowpm

# Application logs
tail -f /var/log/fieldflowpm/app.log
```

#### Health Checks
```bash
# Basic health check
curl http://localhost:5000/api/auth/me

# Database connectivity
npm run db:studio
```

## 📞 Getting Help

### Documentation
- [README.md](README.md) - Project overview
- [API.md](API.md) - API documentation  
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines

### Community
- GitHub Issues for bugs
- GitHub Discussions for questions
- Email: support@fieldflowpm.com

### Professional Support
For enterprise deployment, custom features, or professional support, contact our team at enterprise@fieldflowpm.com.