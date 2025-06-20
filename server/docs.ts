import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes';

export function setupDocs(app: express.Application) {
  try {
    // Load the generated OpenAPI spec
    const spec = require('../docs/swagger.json');
    
    // Serve Swagger UI at /docs
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'FieldFlowPM API Documentation'
    }));

    // Register TSOA routes
    RegisterRoutes(app);
    
    console.log('📚 API Documentation available at /docs');
  } catch (error) {
    console.warn('⚠️ Could not load API documentation:', error.message);
  }
}