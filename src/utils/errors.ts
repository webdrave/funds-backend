// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    
    // This is necessary for extending built-in classes in TypeScript
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Helper function to throw a 404 Not Found error
export function notFound(resource: string = 'Resource'): never {
  throw new ApiError(`${resource} not found`, 404);
}

// Helper function to throw a 400 Bad Request error
export function badRequest(message: string = 'Bad request', details?: any): never {
  throw new ApiError(message, 400, details);
}

// Helper function to throw a 401 Unauthorized error
export function unauthorized(message: string = 'Unauthorized'): never {
  throw new ApiError(message, 401);
}

// Helper function to throw a 403 Forbidden error
export function forbidden(message: string = 'Forbidden'): never {
  throw new ApiError(message, 403);
}

export default {
  ApiError,
  notFound,
  badRequest,
  unauthorized,
  forbidden
};
