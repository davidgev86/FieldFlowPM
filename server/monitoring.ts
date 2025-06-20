import * as Sentry from '@sentry/node';
import type { Express } from 'express';

export function setupMonitoring(app: Express) {
  // Skip Sentry in test environment or if DSN not configured
  if (process.env.NODE_ENV === 'test' || !process.env.SENTRY_DSN) {
    return {
      errorHandler: (err: any, req: any, res: any, next: any) => next(err)
    };
  }

  // Initialize Sentry
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    beforeSend(event) {
      // Filter out non-critical errors in development
      if (process.env.NODE_ENV === 'development') {
        return event.level === 'error' ? event : null;
      }
      return event;
    }
  });

  // Request handler must be the first middleware
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  return {
    // Error handler must be before any other error middleware and after all controllers
    errorHandler: Sentry.Handlers.errorHandler({
      shouldHandleError(error) {
        // Only capture 5xx errors
        return error.status >= 500;
      }
    })
  };
}