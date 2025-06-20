#!/bin/bash

# Integration Test Runner Script
# This script runs the complete integration test suite

set -e

echo "🧪 Starting Integration Test Suite..."

# Set test environment
export NODE_ENV=test

# Run integration tests with coverage
echo "📊 Running tests with coverage..."
npx vitest --config vitest.integration.config.ts --run --coverage

echo "✅ Integration tests completed successfully!"

# Optional: Generate coverage report
if [ "$1" = "--coverage-report" ]; then
    echo "📈 Opening coverage report..."
    npx vitest --config vitest.integration.config.ts --run --coverage --reporter=html
    echo "Coverage report generated in coverage/ directory"
fi