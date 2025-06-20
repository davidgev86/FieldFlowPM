import express from 'express';
import path from 'path';

export function setupDocs(app: express.Application) {
  try {
    // Basic API documentation endpoint
    app.get('/docs', (req, res) => {
      res.json({
        title: 'FieldFlowPM API Documentation',
        version: '1.0.0',
        description: 'Construction Project Management API',
        endpoints: {
          auth: {
            'POST /api/auth/login': 'Authenticate user',
            'POST /api/auth/logout': 'Logout user',
            'GET /api/auth/me': 'Get current user'
          },
          projects: {
            'GET /api/projects': 'List all projects',
            'GET /api/projects/:id': 'Get project by ID',
            'POST /api/projects': 'Create new project',
            'PUT /api/projects/:id': 'Update project'
          },
          costs: {
            'GET /api/projects/:id/costs': 'Get project costs',
            'POST /api/projects/:id/costs': 'Add cost category'
          },
          changeOrders: {
            'GET /api/projects/:id/change-orders': 'Get change orders',
            'POST /api/projects/:id/change-orders': 'Create change order'
          },
          dailyLogs: {
            'GET /api/projects/:id/daily-logs': 'Get daily logs',
            'POST /api/projects/:id/daily-logs': 'Create daily log'
          }
        }
      });
    });
    
    console.log('API Documentation available at /docs');
  } catch (error) {
    console.warn('Could not load API documentation:', error.message);
  }
}