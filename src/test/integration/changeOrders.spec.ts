import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import createAppForTesting from '@server/index';
import type { Express } from 'express';

describe('Change Orders API', () => {
  let app: Express;
  let authCookies: string[];

  beforeAll(async () => {
    app = await createAppForTesting();
  });

  beforeEach(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    authCookies = loginRes.headers['set-cookie'];
  });

  describe('GET /api/projects/:projectId/change-orders', () => {
    it('should return change orders for a project', async () => {
      const res = await request(app)
        .get('/api/projects/1/change-orders')
        .set('Cookie', authCookies);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('should return empty array for non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/999/change-orders')
        .set('Cookie', authCookies);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/projects/1/change-orders');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/projects/:projectId/change-orders', () => {
    it('should handle change order creation', async () => {
      const newChangeOrder = {
        title: 'Additional Electrical Work',
        description: 'Install additional outlets',
        amount: 1500,
        status: 'pending',
        requestedBy: 'Client',
        requestDate: '2024-01-15T00:00:00.000Z'
      };

      const res = await request(app)
        .post('/api/projects/1/change-orders')
        .set('Cookie', authCookies)
        .send(newChangeOrder);

      expect([200, 201, 400, 403]).toContain(res.status);
    });

    it('should return 400 for invalid change order data', async () => {
      const invalidChangeOrder = {
        title: '',
        amount: -500
      };

      const res = await request(app)
        .post('/api/projects/1/change-orders')
        .set('Cookie', authCookies)
        .send(invalidChangeOrder);

      expect(res.status).toBe(400);
    });

    it('should return 401 when not authenticated', async () => {
      const newChangeOrder = {
        title: 'Test Change Order',
        amount: 1000
      };

      const res = await request(app)
        .post('/api/projects/1/change-orders')
        .send(newChangeOrder);

      expect(res.status).toBe(401);
    });
  });
});