import { beforeAll, afterAll } from 'vitest';

// Set test environment
process.env.NODE_ENV = 'test';

beforeAll(async () => {
  // Any global test setup can go here
  console.log('Setting up integration tests...');
});

afterAll(async () => {
  // Any global test cleanup can go here
  console.log('Cleaning up integration tests...');
});