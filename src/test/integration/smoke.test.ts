import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../server/routes';

describe('Smoke Tests', () => {
  let app: express.Application;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  it('should start server without error', () => {
    expect(server).toBeDefined();
  });

  it('should return 404 for non-existent API endpoints', async () => {
    const response = await request(app)
      .get('/api/non-existent-endpoint');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body.message).toContain('not found');
  });

  it('should require authentication for protected endpoints', async () => {
    const protectedEndpoints = [
      '/api/projects',
      '/api/contacts',
      '/api/notifications',
      '/api/auth/me'
    ];

    for (const endpoint of protectedEndpoints) {
      const response = await request(app).get(endpoint);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('status', 'error');
    }
  });

  it('should handle malformed JSON gracefully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }');

    expect(response.status).toBe(400);
  });

  it('should validate Content-Type for POST requests', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'text/plain')
      .send('username=admin&password=admin123');

    // Should either reject the content type or parse it correctly
    expect([400, 401]).toContain(response.status);
  });

  it('should handle large request bodies appropriately', async () => {
    const largeData = {
      username: 'a'.repeat(10000),
      password: 'b'.repeat(10000)
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(largeData);

    // Should handle large requests gracefully (either accept or reject)
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('should include security headers', async () => {
    const response = await request(app)
      .get('/api/auth/login');

    // These would be added by security middleware in production
    // For now, just ensure the response doesn't leak sensitive info
    expect(response.headers).not.toHaveProperty('x-powered-by');
  });

  it('should handle concurrent requests without crashing', async () => {
    const requests = Array(10).fill(null).map(() => 
      request(app).get('/api/auth/me')
    );

    const responses = await Promise.all(requests);
    
    // All should return 401 (unauthorized) consistently
    responses.forEach(response => {
      expect(response.status).toBe(401);
    });
  });

  it('should maintain session consistency', async () => {
    // Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    expect(loginResponse.status).toBe(200);
    const sessionCookie = loginResponse.headers['set-cookie'];

    // Verify session works immediately
    const verifyResponse = await request(app)
      .get('/api/auth/me')
      .set('Cookie', sessionCookie);

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body).toHaveProperty('username', 'admin');

    // Session should work for multiple requests
    const secondVerifyResponse = await request(app)
      .get('/api/auth/me')
      .set('Cookie', sessionCookie);

    expect(secondVerifyResponse.status).toBe(200);
    expect(secondVerifyResponse.body).toHaveProperty('username', 'admin');
  });

  it('should handle database operations without errors', async () => {
    // Login first
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    const sessionCookie = loginResponse.headers['set-cookie'];

    // Test basic CRUD operations
    const projectsResponse = await request(app)
      .get('/api/projects')
      .set('Cookie', sessionCookie);

    expect(projectsResponse.status).toBe(200);
    expect(Array.isArray(projectsResponse.body)).toBe(true);

    const contactsResponse = await request(app)
      .get('/api/contacts')
      .set('Cookie', sessionCookie);

    expect(contactsResponse.status).toBe(200);
    expect(Array.isArray(contactsResponse.body)).toBe(true);
  });
});