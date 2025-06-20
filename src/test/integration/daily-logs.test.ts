import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '@server/app';
import type { Express } from 'express';

describe('Daily Logs API', () => {
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

  describe('GET /api/projects/:projectId/daily-logs', () => {
    it('should return daily logs for a project', async () => {
      const res = await request(app)
        .get('/api/projects/1/daily-logs')
        .set('Cookie', authCookies);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      
      if (res.body.length > 0) {
        const dailyLog = res.body[0];
        expect(dailyLog).toHaveProperty('id');
        expect(dailyLog).toHaveProperty('date');
        expect(dailyLog).toHaveProperty('weather');
        expect(dailyLog).toHaveProperty('workPerformed');
        expect(dailyLog).toHaveProperty('crewSize');
        expect(dailyLog).toHaveProperty('projectId');
      }
    });

    it('should return 404 for non-existent project', async () => {
      const res = await request(app)
        .get('/api/projects/999/daily-logs')
        .set('Cookie', authCookies);

      expect(res.status).toBe(404);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/projects/1/daily-logs');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/projects/:projectId/daily-logs', () => {
    it('should create new daily log with valid data', async () => {
      const newDailyLog = {
        date: '2024-01-15',
        weather: 'Sunny, 75°F',
        workPerformed: 'Framing second floor walls, installed electrical rough-in',
        crewSize: 6,
        hoursWorked: 8,
        materialsUsed: 'Lumber, electrical wire, junction boxes',
        equipmentUsed: 'Circular saw, drill, level',
        notes: 'Good progress made on framing'
      };

      const res = await request(app)
        .post('/api/projects/1/daily-logs')
        .set('Cookie', authCookies)
        .send(newDailyLog);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('date', newDailyLog.date);
      expect(res.body).toHaveProperty('weather', newDailyLog.weather);
      expect(res.body).toHaveProperty('workPerformed', newDailyLog.workPerformed);
      expect(res.body).toHaveProperty('crewSize', newDailyLog.crewSize);
      expect(res.body).toHaveProperty('projectId', 1);
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
        date: '2024-01-15',
        weather: 'Sunny',
        workPerformed: 'Test work',
        crewSize: 4
      };

      const res = await request(app)
        .post('/api/projects/1/daily-logs')
        .send(newDailyLog);

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/projects/:projectId/daily-logs/:id', () => {
    it('should update existing daily log', async () => {
      const newDailyLog = {
        date: '2024-01-16',
        weather: 'Cloudy',
        workPerformed: 'Initial work',
        crewSize: 4
      };

      const createRes = await request(app)
        .post('/api/projects/1/daily-logs')
        .set('Cookie', authCookies)
        .send(newDailyLog);

      const dailyLogId = createRes.body.id;

      const updates = {
        weather: 'Rainy, 65°F',
        workPerformed: 'Updated work description with additional details',
        crewSize: 5
      };

      const updateRes = await request(app)
        .put(`/api/projects/1/daily-logs/${dailyLogId}`)
        .set('Cookie', authCookies)
        .send(updates);

      expect(updateRes.status).toBe(200);
      expect(updateRes.body).toHaveProperty('weather', updates.weather);
      expect(updateRes.body).toHaveProperty('workPerformed', updates.workPerformed);
      expect(updateRes.body).toHaveProperty('crewSize', updates.crewSize);
    });

    it('should return 404 for non-existent daily log', async () => {
      const res = await request(app)
        .put('/api/projects/1/daily-logs/999')
        .set('Cookie', authCookies)
        .send({ weather: 'Updated weather' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/projects/:projectId/daily-logs/:id', () => {
    it('should delete existing daily log', async () => {
      const newDailyLog = {
        date: '2024-01-17',
        weather: 'Sunny',
        workPerformed: 'Work to be deleted',
        crewSize: 3
      };

      const createRes = await request(app)
        .post('/api/projects/1/daily-logs')
        .set('Cookie', authCookies)
        .send(newDailyLog);

      const dailyLogId = createRes.body.id;

      const deleteRes = await request(app)
        .delete(`/api/projects/1/daily-logs/${dailyLogId}`)
        .set('Cookie', authCookies);

      expect(deleteRes.status).toBe(200);
    });

    it('should return 404 for non-existent daily log', async () => {
      const res = await request(app)
        .delete('/api/projects/1/daily-logs/999')
        .set('Cookie', authCookies);

      expect(res.status).toBe(404);
    });
  });
});