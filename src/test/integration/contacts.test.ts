import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '@server/app';
import type { Express } from 'express';

describe('Contacts API', () => {
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

  describe('GET /api/contacts', () => {
    it('should return contacts for authenticated user', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Cookie', authCookies);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      
      if (res.body.length > 0) {
        const contact = res.body[0];
        expect(contact).toHaveProperty('id');
        expect(contact).toHaveProperty('name');
        expect(contact).toHaveProperty('email');
        expect(contact).toHaveProperty('phone');
        expect(contact).toHaveProperty('type');
        expect(contact).toHaveProperty('companyId');
      }
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .get('/api/contacts');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /api/contacts', () => {
    it('should create new contact with valid data', async () => {
      const newContact = {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '555-0123',
        type: 'contractor',
        company: 'Smith Construction',
        companyId: 1
      };

      const res = await request(app)
        .post('/api/contacts')
        .set('Cookie', authCookies)
        .send(newContact);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('name', newContact.name);
      expect(res.body).toHaveProperty('email', newContact.email);
      expect(res.body).toHaveProperty('phone', newContact.phone);
      expect(res.body).toHaveProperty('type', newContact.type);
    });

    it('should return 400 for invalid contact data', async () => {
      const invalidContact = {
        name: '',
        email: 'invalid-email'
      };

      const res = await request(app)
        .post('/api/contacts')
        .set('Cookie', authCookies)
        .send(invalidContact);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 401 when not authenticated', async () => {
      const newContact = {
        name: 'Test Contact',
        email: 'test@example.com',
        type: 'client'
      };

      const res = await request(app)
        .post('/api/contacts')
        .send(newContact);

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/contacts/:id', () => {
    it('should update existing contact', async () => {
      // First create a contact
      const newContact = {
        name: 'Contact to Update',
        email: 'update@example.com',
        phone: '555-0999',
        type: 'supplier',
        companyId: 1
      };

      const createRes = await request(app)
        .post('/api/contacts')
        .set('Cookie', authCookies)
        .send(newContact);

      const contactId = createRes.body.id;

      // Then update it
      const updates = {
        name: 'Updated Contact Name',
        phone: '555-1111'
      };

      const updateRes = await request(app)
        .put(`/api/contacts/${contactId}`)
        .set('Cookie', authCookies)
        .send(updates);

      expect(updateRes.status).toBe(200);
      expect(updateRes.body).toHaveProperty('name', updates.name);
      expect(updateRes.body).toHaveProperty('phone', updates.phone);
    });

    it('should return 404 for non-existent contact', async () => {
      const res = await request(app)
        .put('/api/contacts/999')
        .set('Cookie', authCookies)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/contacts/:id', () => {
    it('should delete existing contact', async () => {
      // First create a contact to delete
      const newContact = {
        name: 'Contact to Delete',
        email: 'delete@example.com',
        type: 'other',
        companyId: 1
      };

      const createRes = await request(app)
        .post('/api/contacts')
        .set('Cookie', authCookies)
        .send(newContact);

      const contactId = createRes.body.id;

      // Then delete it
      const deleteRes = await request(app)
        .delete(`/api/contacts/${contactId}`)
        .set('Cookie', authCookies);

      expect(deleteRes.status).toBe(200);
    });

    it('should return 404 for non-existent contact', async () => {
      const res = await request(app)
        .delete('/api/contacts/999')
        .set('Cookie', authCookies);

      expect(res.status).toBe(404);
    });
  });
});