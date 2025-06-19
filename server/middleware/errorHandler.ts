import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors';

export interface ApiError extends Error {
  status?: number;
  statusCode?: number;
  details?: any;
}

/**
 * Global error handling middleware
 * @param err - Error instance
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function errorHandler(err: ApiError | AppError, req: Request, res: Response, next: NextFunction) {
  // Log error for debugging
  console.error('API Error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    details: 'details' in err ? err.details : undefined,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      details: {
        validationErrors: err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }))
      }
    });
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.status).json({
      status: 'error',
      message: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // Get status code for generic errors
  const status = err.status || err.statusCode || 500;
  
  // Don't leak internal error details in production
  const message = status === 500 && process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message || 'Something went wrong';

  res.status(status).json({ 
    status: 'error',
    message 
  });
}

/**
 * 404 handler for unmatched routes
 * @param req - Express request object
 * @param res - Express response object
 */
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ 
    status: 'error',
    message: `Route ${req.method} ${req.path} not found` 
  });
}