export class AppError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, status: number = 500, isOperational: boolean = true, details?: any) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
    this.details = details;

    // Ensure the name of this error is the same as the class name
    this.name = this.constructor.name;

    // This clips the constructor invocation from the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (status: number, message: string, details?: any) => {
  return new AppError(message, status, true, details);
};

export const createValidationError = (message: string, errors: any[]) => {
  return new AppError(message, 400, true, { validationErrors: errors });
};

export const createNotFoundError = (resource: string = 'Resource') => {
  return new AppError(`${resource} not found`, 404);
};

export const createUnauthorizedError = (message: string = 'Unauthorized access') => {
  return new AppError(message, 401);
};

export const createForbiddenError = (message: string = 'Insufficient permissions') => {
  return new AppError(message, 403);
};