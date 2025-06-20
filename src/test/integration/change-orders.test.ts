import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '@server/app';
import type { Express } from 'express';

describe('Change Orders API', () => {
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
      
      if (res.body.length > 0) {
        const changeOrder = res.body[0];
        expect(changeOrder).toHaveProperty('id');
        expect(changeOrder).toHaveProperty('title');
        expect(changeOrder).toHaveProperty('description');
        expect(changeOrder).toHaveProperty('amount');
        expect(changeOrder).toHaveProperty('status');
        expect(changeOrder).toHaveProperty('projectId');
      }
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/999/change-orders')
        .set('Cookie', authCookies);

      expect(res.status).toBe(404);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/projects/1/change-orders');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/projects/:projectId/change-orders', () => {
    it('should create new change order with valid data', async () => {
      const newChangeOrder = {
        title: 'Additional Electrical Work',
        description: 'Install additional outlets in kitchen',
        amount: 1500,
        status: 'pending',
        requestedBy: 'Client',
        requestDate: '2024-01-15'
      };

      const res = await request(app)
        .post('/api/projects/1/change-orders')
        .set('Cookie', authCookies)
        .send(newChangeOrder);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', newChangeOrder.title);
      expect(res.body).toHaveProperty('amount', newChangeOrder.amount);
      expect(res.body).toHaveProperty('status', newChangeOrder.status);
      expect(res.body).toHaveProperty('projectId', 1);
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
        amount: 1000,
        status: 'pending'
      };

      const res = await request(app)
        .post('/api/projects/1/change-orders')
        .send(newChangeOrder);

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/projects/:projectId/change-orders/:id', () => {
    it('should update existing change order', async () => {
      const newChangeOrder = {
        title: 'Change Order to Update',
        amount: 2000,
        status: 'pending'
      };

      const createRes = await request(app)
        .post('/api/projects/1/change-orders')
        .set('Cookie', authCookies)
        .send(newChangeOrder);

      const changeOrderId = createRes.body.id;

      const updates = {
        status: 'approved',
        amount: 2500
      };

      const updateRes = await request(app)
        .put(`/api/projects/1/change-orders/${changeOrderId}`)
        .set('Cookie', authCookies)
        .send(updates);

      expect(updateRes.status).toBe(200);
      expect(updateRes.body).toHaveProperty('status', updates.status);
      expect(updateRes.body).toHaveProperty('amount', updates.amount);
    });

    it('should return 404 for non-existent change order', async () => {
      const res = await request(app)
        .put('/api/projects/1/change-orders/999')
        .set('Cookie', authCookies)
        .send({ status: 'approved' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/projects/:projectId/change-orders/:id', () => {
    it('should delete existing change order', async () => {
      const newChangeOrder = {
        title: 'Change Order to Delete',
        amount: 1000,
        status: 'pending'
      };

      const createRes = await request(app)
        .post('/api/projects/1/change-orders')
        .set('Cookie', authCookies)
        .send(newChangeOrder);

      const changeOrderId = createRes.body.id;

      const deleteRes = await request(app)
        .delete(`/api/projects/1/change-orders/${changeOrderId}`)
        .set('Cookie', authCookies);

      expect(deleteRes.status).toBe(200);
    });

    it('should return 404 for non-existent change order', async () => {
      const res = await request(app)
        .delete('/api/projects/1/change-orders/999')
        .set('Cookie', authCookies);

      expect(res.status).toBe(404);
    });
  });
});