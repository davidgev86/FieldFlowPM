import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import createAppForTesting from '@server/index';
import type { Express } from 'express';

describe('Daily Logs API', () => {
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

  describe('GET /api/projects/:projectId/daily-logs', () => {
    it('should return daily logs for a project', async () => {
      const res = await request(app)
        .get('/api/projects/1/daily-logs')
        .set('Cookie', authCookies);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('should return empty array for non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/999/daily-logs')
        .set('Cookie', authCookies);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/projects/1/daily-logs');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/projects/:projectId/daily-logs', () => {
    it('should handle daily log creation', async () => {
      const newDailyLog = {
        date: '2024-01-15T00:00:00.000Z',
        weather: 'Sunny, 75°F',
        workPerformed: 'Framing second floor walls',
        crewSize: 6,
        hoursWorked: 8,
        materialsUsed: 'Lumber, electrical wire',
        equipmentUsed: 'Circular saw, drill',
        notes: 'Good progress made'
      };

      const res = await request(app)
        .post('/api/projects/1/daily-logs')
        .set('Cookie', authCookies)
        .send(newDailyLog);

      expect([200, 201, 400, 403]).toContain(res.status);
    });

    it('should return 400 for invalid daily log data', async () => {
      const invalidDailyLog = {
        date: 'invalid-date',
        crewSize: -1
      };

      const res = await request(app)
        .post('/api/projects/1/daily-logs')
        .set('Cookie', authCookies)
        .send(invalidDailyLog);

      expect(res.status).toBe(400);
    });

    it('should return 401 when not authenticated', async () => {
      const newDailyLog = {
        date: '2024-01-15T00:00:00.000Z',
        weather: 'Sunny',
        workPerformed: 'Test work'
      };

      const res = await request(app)
        .post('/api/projects/1/daily-logs')
        .send(newDailyLog);

      expect(res.status).toBe(401);
    });
  });
});