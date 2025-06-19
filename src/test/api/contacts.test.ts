import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../server/routes';

describe('Contacts API', () => {
  let app: express.Application;
  let server: any;
  let authCookie: string;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);

    // Login to get auth session
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    expect(loginResponse.status).toBe(200);
    authCookie = loginResponse.headers['set-cookie'];
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
  });

  describe('GET /api/contacts', () => {
    it('should return contacts for authenticated user', async () => {
      const response = await request(app)
        .get('/api/contacts')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter contacts by type', async () => {
      const response = await request(app)
        .get('/api/contacts?type=client')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // All returned contacts should be of type 'client'
      response.body.forEach((contact: any) => {
        expect(contact.type).toBe('client');
      });
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/contacts');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/contacts', () => {
    it('should create new contact with valid data', async () => {
      const newContact = {
        type: 'client',
        firstName: 'Test',
        lastName: 'Contact',
        email: 'test@contact.com',
        phone: '+1555123456',
        company: 'Test Company',
        address: '456 Test Street',
        notes: 'Created during testing'
      };

      const response = await request(app)
        .post('/api/contacts')
        .set('Cookie', authCookie)
        .send(newContact);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toMatchObject({
        type: newContact.type,
        firstName: newContact.firstName,
        lastName: newContact.lastName,
        email: newContact.email
      });
    });

    it('should create contact with minimal required data', async () => {
      const minimalContact = {
        type: 'subcontractor',
        firstName: 'Minimal',
        lastName: 'Contact'
      };

      const response = await request(app)
        .post('/api/contacts')
        .set('Cookie', authCookie)
        .send(minimalContact);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(minimalContact);
    });

    it('should reject invalid contact data', async () => {
      const invalidContact = {
        type: 'invalid-type',
        firstName: 'Invalid'
      };

      const response = await request(app)
        .post('/api/contacts')
        .set('Cookie', authCookie)
        .send(invalidContact);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should reject contact with missing required fields', async () => {
      const incompleteContact = {
        type: 'client'
        // Missing firstName and lastName
      };

      const response = await request(app)
        .post('/api/contacts')
        .set('Cookie', authCookie)
        .send(incompleteContact);

      expect(response.status).toBe(400);
    });

    it('should reject unauthenticated requests', async () => {
      const newContact = {
        type: 'client',
        firstName: 'Unauthorized',
        lastName: 'Contact'
      };

      const response = await request(app)
        .post('/api/contacts')
        .send(newContact);

      expect(response.status).toBe(401);
    });
  });
});