import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '@server/app';
import type { Express } from 'express';

describe('Cost Categories API', () => {
  let app: Express;
  let authCookies: string[];

  beforeAll(async () => {
    const { app: testApp } = await createApp({ 
      isDevelopment: false, 
      setupViteMiddleware: false 
    });
    app = testApp;
  });

  beforeEach(async () => {
    // Login before each test
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
      
      if (res.body.length > 0) {
        const costCategory = res.body[0];
        expect(costCategory).toHaveProperty('id');
        expect(costCategory).toHaveProperty('name');
        expect(costCategory).toHaveProperty('budgetAmount');
        expect(costCategory).toHaveProperty('actualAmount');
        expect(costCategory).toHaveProperty('projectId');
      }
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/999/costs')
        .set('Cookie', authCookies);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
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
        name: 'Test Cost Category',
        description: 'A test cost category',
        budgetAmount: 10000,
        actualAmount: 0
      };

      const res = await request(app)
        .post('/api/projects/1/costs')
        .set('Cookie', authCookies)
        .send(newCostCategory);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', newCostCategory.name);
      expect(res.body).toHaveProperty('budgetAmount', newCostCategory.budgetAmount);
      expect(res.body).toHaveProperty('actualAmount', newCostCategory.actualAmount);
      expect(res.body).toHaveProperty('projectId', 1);
    });

    it('should return 400 for invalid cost category data', async () => {
      const invalidCostCategory = {
        name: '', // Empty name should be invalid
        budgetAmount: -1000 // Negative budget should be invalid
      };

      const res = await request(app)
        .post('/api/projects/1/costs')
        .set('Cookie', authCookies)
        .send(invalidCostCategory);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent project', async () => {
      const newCostCategory = {
        name: 'Test Cost Category',
        budgetAmount: 10000,
        actualAmount: 0
      };

      const res = await request(app)
        .post('/api/projects/999/costs')
        .set('Cookie', authCookies)
        .send(newCostCategory);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 401 when not authenticated', async () => {
      const newCostCategory = {
        name: 'Test Cost Category',
        budgetAmount: 10000,
        actualAmount: 0
      };

      const res = await request(app)
        .post('/api/projects/1/costs')
        .send(newCostCategory);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/projects/:projectId/costs/:id', () => {
    it('should update existing cost category', async () => {
      // First create a cost category
      const newCostCategory = {
        name: 'Cost Category to Update',
        budgetAmount: 10000,
        actualAmount: 0
      };

      const createRes = await request(app)
        .post('/api/projects/1/costs')
        .set('Cookie', authCookies)
        .send(newCostCategory);

      const costCategoryId = createRes.body.id;

      // Then update it
      const updates = {
        name: 'Updated Cost Category',
        actualAmount: 5000
      };

      const updateRes = await request(app)
        .put(`/api/projects/1/costs/${costCategoryId}`)
        .set('Cookie', authCookies)
        .send(updates);

      expect(updateRes.status).toBe(200);
      expect(updateRes.body).toHaveProperty('id', costCategoryId);
      expect(updateRes.body).toHaveProperty('name', updates.name);
      expect(updateRes.body).toHaveProperty('actualAmount', updates.actualAmount);
    });

    it('should return 404 for non-existent cost category', async () => {
      const updates = {
        name: 'Updated Name'
      };

      const res = await request(app)
        .put('/api/projects/1/costs/999')
        .set('Cookie', authCookies)
        .send(updates);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 401 when not authenticated', async () => {
      const updates = {
        name: 'Updated Name'
      };

      const res = await request(app)
        .put('/api/projects/1/costs/1')
        .send(updates);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/projects/:projectId/costs/:id', () => {
    it('should delete existing cost category', async () => {
      // First create a cost category to delete
      const newCostCategory = {
        name: 'Cost Category to Delete',
        budgetAmount: 5000,
        actualAmount: 0
      };

      const createRes = await request(app)
        .post('/api/projects/1/costs')
        .set('Cookie', authCookies)
        .send(newCostCategory);

      const costCategoryId = createRes.body.id;

      // Then delete it
      const deleteRes = await request(app)
        .delete(`/api/projects/1/costs/${costCategoryId}`)
        .set('Cookie', authCookies);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toHaveProperty('message');
    });

    it('should return 404 for non-existent cost category', async () => {
      const res = await request(app)
        .delete('/api/projects/1/costs/999')
        .set('Cookie', authCookies);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .delete('/api/projects/1/costs/1');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });
});