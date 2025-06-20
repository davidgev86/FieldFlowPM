#!/bin/bash

# Build API Documentation Script

echo "Building API documentation..."

# Generate TypeScript routes for TSOA
npx tsoa spec-and-routes

# Generate OpenAPI spec
npx tsoa spec

echo "API documentation generated successfully!"
echo "Spec available at: docs/swagger.json"
echo "View at: http://localhost:5000/docs"