import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '@server/app';
import type { Express } from 'express';

describe('API Smoke Tests', () => {
  let app: Express;

  beforeAll(async () => {
    const { app: testApp } = await createApp({ 
      isDevelopment: false, 
      setupViteMiddleware: false 
    });
    app = testApp;
  });

  it('should respond to health check', async () => {
    const res = await request(app).get('/');
    // Should either return 404 (no route) or 200 (if health check exists)
    expect([200, 404]).toContain(res.status);
  });

  it('should require authentication for protected routes', async () => {
    const protectedRoutes = [
      '/api/projects',
      '/api/auth/me',
      '/api/contacts',
      '/api/notifications'
    ];

    for (const route of protectedRoutes) {
      const res = await request(app).get(route);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    }
  });

  it('should handle non-existent routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Route not found');
  });
});