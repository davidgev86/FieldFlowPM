import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '@server/app';
import type { Express } from 'express';

describe('Notifications API', () => {
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

  describe('GET /api/notifications', () => {
    it('should return notifications for authenticated user', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Cookie', authCookies);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      
      if (res.body.length > 0) {
        const notification = res.body[0];
        expect(notification).toHaveProperty('id');
        expect(notification).toHaveProperty('title');
        expect(notification).toHaveProperty('message');
        expect(notification).toHaveProperty('type');
        expect(notification).toHaveProperty('isRead');
        expect(notification).toHaveProperty('userId');
        expect(notification).toHaveProperty('createdAt');
      }
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/notifications');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('GET /api/notifications/unread', () => {
    it('should return unread notifications count', async () => {
      const res = await request(app)
        .get('/api/notifications/unread')
        .set('Cookie', authCookies);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('count');
      expect(typeof res.body.count).toBe('number');
      expect(res.body.count).toBeGreaterThanOrEqual(0);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/notifications/unread');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/notifications/:id/read', () => {
    it('should mark notification as read', async () => {
      // First get notifications to find one to mark as read
      const notificationsRes = await request(app)
        .get('/api/notifications')
        .set('Cookie', authCookies);

      if (notificationsRes.body.length > 0) {
        const unreadNotification = notificationsRes.body.find((n: any) => !n.isRead);
        
        if (unreadNotification) {
          const res = await request(app)
            .put(`/api/notifications/${unreadNotification.id}/read`)
            .set('Cookie', authCookies);

          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('message');
        }
      }
    });

    it('should return 404 for non-existent notification', async () => {
      const res = await request(app)
        .put('/api/notifications/999/read')
        .set('Cookie', authCookies);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .put('/api/notifications/1/read');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/notifications', () => {
    it('should create new notification', async () => {
      const newNotification = {
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'info',
        userId: 1
      };

      const res = await request(app)
        .post('/api/notifications')
        .set('Cookie', authCookies)
        .send(newNotification);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('title', newNotification.title);
      expect(res.body).toHaveProperty('message', newNotification.message);
      expect(res.body).toHaveProperty('type', newNotification.type);
      expect(res.body).toHaveProperty('isRead', false);
    });

    it('should return 400 for invalid notification data', async () => {
      const invalidNotification = {
        title: '',
        message: ''
      };

      const res = await request(app)
        .post('/api/notifications')
        .set('Cookie', authCookies)
        .send(invalidNotification);

      expect(res.status).toBe(400);
    });

    it('should return 401 when not authenticated', async () => {
      const newNotification = {
        title: 'Test',
        message: 'Test message',
        type: 'info'
      };

      const res = await request(app)
        .post('/api/notifications')
        .send(newNotification);

      expect(res.status).toBe(401);
    });
  });
});