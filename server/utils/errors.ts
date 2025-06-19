/**
 * Custom application error class for consistent error handling
 * @extends Error
 */
export class AppError extends Error {
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  /**
   * Creates a new AppError instance
   * @param message - Error message
   * @param status - HTTP status code
   * @param isOperational - Whether this is an operational error (vs programming error)
   * @param details - Additional error details
   */
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

/**
 * Creates a generic application error
 * @param status - HTTP status code
 * @param message - Error message
 * @param details - Optional additional details
 * @returns AppError instance
 */
export const createError = (status: number, message: string, details?: any) => {
  return new AppError(message, status, true, details);
};

/**
 * Creates a validation error (400 status)
 * @param message - Error message
 * @param errors - Array of validation errors
 * @returns AppError instance with validation details
 */
export const createValidationError = (message: string, errors: any[]) => {
  return new AppError(message, 400, true, { validationErrors: errors });
};

/**
 * Creates a not found error (404 status)
 * @param resource - Name of the resource that wasn't found
 * @returns AppError instance
 */
export const createNotFoundError = (resource: string = 'Resource') => {
  return new AppError(`${resource} not found`, 404);
};

/**
 * Creates an unauthorized error (401 status)
 * @param message - Custom error message
 * @returns AppError instance
 */
export const createUnauthorizedError = (message: string = 'Unauthorized access') => {
  return new AppError(message, 401);
};

/**
 * Creates a forbidden error (403 status)
 * @param message - Custom error message
 * @returns AppError instance
 */
export const createForbiddenError = (message: string = 'Insufficient permissions') => {
  return new AppError(message, 403);
};