import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../server/routes';

describe('Projects API', () => {
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

  describe('GET /api/projects', () => {
    it('should return projects for authenticated user', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Cookie', authCookie);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      if (response.body.length > 0) {
        const project = response.body[0];
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
        expect(project).toHaveProperty('status');
        expect(project).toHaveProperty('companyId');
      }
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return specific project for authenticated user', async () => {
      // First get available projects
      const projectsResponse = await request(app)
        .get('/api/projects')
        .set('Cookie', authCookie);

      expect(projectsResponse.status).toBe(200);
      
      if (projectsResponse.body.length > 0) {
        const projectId = projectsResponse.body[0].id;
        
        const response = await request(app)
          .get(`/api/projects/${projectId}`)
          .set('Cookie', authCookie);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', projectId);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('status');
      }
    });

    it('should return 404 for non-existent project', async () => {
      const response = await request(app)
        .get('/api/projects/99999')
        .set('Cookie', authCookie);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/projects/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/projects', () => {
    it('should create new project with valid data', async () => {
      const newProject = {
        name: 'Test Project Creation',
        description: 'A project created during testing',
        address: '123 Test Avenue',
        status: 'planning',
        clientId: 2,
        budgetTotal: '25000.00',
        startDate: '2024-06-01T00:00:00.000Z',
        dueDate: '2024-08-01T00:00:00.000Z'
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send(newProject);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toMatchObject({
        name: newProject.name,
        description: newProject.description,
        status: newProject.status
      });
    });

    it('should reject invalid project data', async () => {
      const invalidProject = {
        description: 'Missing required fields like name'
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send(invalidProject);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('status', 'error');
    });

    it('should reject unauthenticated requests', async () => {
      const newProject = {
        name: 'Unauthorized Project',
        status: 'planning',
        clientId: 2
      };

      const response = await request(app)
        .post('/api/projects')
        .send(newProject);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update existing project', async () => {
      // First create a project to update
      const newProject = {
        name: 'Project to Update',
        status: 'planning',
        clientId: 2,
        budgetTotal: '15000.00'
      };

      const createResponse = await request(app)
        .post('/api/projects')
        .set('Cookie', authCookie)
        .send(newProject);

      expect(createResponse.status).toBe(201);
      const projectId = createResponse.body.id;

      // Now update the project
      const updateData = {
        name: 'Updated Project Name',
        status: 'active',
        budgetTotal: '20000.00'
      };

      const updateResponse = await request(app)
        .put(`/api/projects/${projectId}`)
        .set('Cookie', authCookie)
        .send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toMatchObject({
        id: projectId,
        name: updateData.name,
        status: updateData.status,
        budgetTotal: updateData.budgetTotal
      });
    });

    it('should return 404 for non-existent project', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put('/api/projects/99999')
        .set('Cookie', authCookie)
        .send(updateData);

      expect(response.status).toBe(404);
    });

    it('should reject unauthenticated requests', async () => {
      const updateData = {
        name: 'Unauthorized Update'
      };

      const response = await request(app)
        .put('/api/projects/1')
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });
});