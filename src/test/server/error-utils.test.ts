import { describe, it, expect } from 'vitest';
import { 
  AppError, 
  createError, 
  createValidationError, 
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError 
} from '../../server/utils/errors';

describe('Error Utils', () => {
  describe('AppError', () => {
    it('should create error with default values', () => {
      const error = new AppError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe('AppError');
    });

    it('should create error with custom values', () => {
      const details = { field: 'test' };
      const error = new AppError('Custom error', 400, false, details);
      
      expect(error.message).toBe('Custom error');
      expect(error.status).toBe(400);
      expect(error.isOperational).toBe(false);
      expect(error.details).toEqual(details);
    });
  });

  describe('createError', () => {
    it('should create error with specified status and message', () => {
      const error = createError(404, 'Not found');
      
      expect(error).toBeInstanceOf(AppError);
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not found');
    });
  });

  describe('createValidationError', () => {
    it('should create validation error with details', () => {
      const errors = [{ field: 'email', message: 'Invalid email' }];
      const error = createValidationError('Validation failed', errors);
      
      expect(error.status).toBe(400);
      expect(error.message).toBe('Validation failed');
      expect(error.details).toEqual({ validationErrors: errors });
    });
  });

  describe('createNotFoundError', () => {
    it('should create 404 error with default message', () => {
      const error = createNotFoundError();
      
      expect(error.status).toBe(404);
      expect(error.message).toBe('Resource not found');
    });

    it('should create 404 error with custom resource name', () => {
      const error = createNotFoundError('Project');
      
      expect(error.status).toBe(404);
      expect(error.message).toBe('Project not found');
    });
  });

  describe('createUnauthorizedError', () => {
    it('should create 401 error', () => {
      const error = createUnauthorizedError();
      
      expect(error.status).toBe(401);
      expect(error.message).toBe('Unauthorized access');
    });
  });

  describe('createForbiddenError', () => {
    it('should create 403 error', () => {
      const error = createForbiddenError();
      
      expect(error.status).toBe(403);
      expect(error.message).toBe('Insufficient permissions');
    });
  });
});