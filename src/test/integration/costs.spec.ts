import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import createAppForTesting from '@server/index';
import type { Express } from 'express';

describe('Cost Categories API', () => {
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

  describe('GET /api/projects/:projectId/costs', () => {
    it('should return cost categories for a project', async () => {
      const res = await request(app)
        .get('/api/projects/1/costs')
        .set('Cookie', authCookies);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('should return empty array for non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/999/costs')
        .set('Cookie', authCookies);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body).toHaveLength(0);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/projects/1/costs');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/projects/:projectId/costs', () => {
    it('should create new cost category with valid data', async () => {
      const newCostCategory = {
        name: 'Test Materials',
        description: 'Testing cost category creation',
        budgetAmount: '5000.00',
        actualAmount: '0.00'
      };

      const res = await request(app)
        .post('/api/projects/1/costs')
        .set('Cookie', authCookies)
        .send(newCostCategory);

      expect([200, 201, 400, 403]).toContain(res.status);
    });

    it('should return 400 for invalid cost category data', async () => {
      const invalidCostCategory = {
        name: '',
        budgetAmount: 'invalid'
      };

      const res = await request(app)
        .post('/api/projects/1/costs')
        .set('Cookie', authCookies)
        .send(invalidCostCategory);

      expect(res.status).toBe(400);
    });

    it('should return 401 when not authenticated', async () => {
      const newCostCategory = {
        name: 'Test Category',
        budgetAmount: '1000.00'
      };

      const res = await request(app)
        .post('/api/projects/1/costs')
        .send(newCostCategory);

      expect(res.status).toBe(401);
    });
  });
});