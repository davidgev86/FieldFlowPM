#!/bin/bash

# FieldFlowPM Code Quality Check Script
# This script runs all code quality checks and reports issues

set -e

echo "🔍 Running FieldFlowPM Code Quality Checks..."
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
        exit 1
    fi
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

echo ""
print_info "Step 1: Checking TypeScript compilation..."
if npm run type-check; then
    print_status 0 "TypeScript compilation"
else
    print_status 1 "TypeScript compilation failed"
fi

echo ""
print_info "Step 2: Running ESLint..."
if npm run lint; then
    print_status 0 "ESLint checks"
else
    print_warning "ESLint found issues. Try running 'npm run lint:fix' to auto-fix."
    exit 1
fi

echo ""
print_info "Step 3: Checking Prettier formatting..."
if npm run format:check; then
    print_status 0 "Prettier formatting"
else
    print_warning "Code formatting issues found. Run 'npm run format' to fix."
    exit 1
fi

echo ""
print_info "Step 4: Running tests..."
if npm run test:run; then
    print_status 0 "Test suite"
else
    print_status 1 "Tests failed"
fi

echo ""
print_info "Step 5: Checking for security vulnerabilities..."
if npm audit --audit-level moderate; then
    print_status 0 "Security audit"
else
    print_warning "Security vulnerabilities found. Run 'npm audit fix' to resolve."
fi

echo ""
echo -e "${GREEN}🎉 All code quality checks passed!${NC}"
echo "Your code is ready for commit/push."