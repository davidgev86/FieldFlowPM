# Integration Test Scripts Documentation

The following npm script should be added to package.json:

```json
{
  "scripts": {
    "test:integration": "vitest -c vitest.integration.config.ts"
  }
}
```

## Usage:

```bash
# Run integration tests
npm run test:integration

# Run with coverage
npm run test:integration -- --coverage

# Run in watch mode
npm run test:integration -- --watch
```

## Alternative Commands:

```bash
# Direct vitest commands
NODE_ENV=test npx vitest --config vitest.integration.config.ts --run
NODE_ENV=test npx vitest --config vitest.integration.config.ts --run --coverage
```