import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  status?: number;
  statusCode?: number;
}

export function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
  // Log error for debugging
  console.error('API Error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Get status code
  const status = err.status || err.statusCode || 500;
  
  // Don't leak internal error details in production
  const message = status === 500 && process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Something went wrong';

  res.status(status).json({ message });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ 
    message: `Route ${req.method} ${req.path} not found` 
  });
}