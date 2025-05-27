import { Request, Response, NextFunction } from 'express';
import * as validation from './validation';

// Middleware for logging requests
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log when the request starts
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Request received`);
  
  // Log when the response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Response sent - Status: ${res.statusCode} - Duration: ${duration}ms`);
  });
  
  next();
};

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  
  // Check if headers have already been sent
  if (res.headersSent) {
    return next(err);
  }
  
  // Check if it's our custom ApiError
  if (err.name === 'ApiError' && 'statusCode' in err) {
    const apiError = err as any;
    return res.status(apiError.statusCode).json({
      error: {
        message: apiError.message,
        ...(apiError.details && { details: apiError.details }),
        ...(process.env.NODE_ENV === 'development' && { stack: apiError.stack }),
      }
    });
  }
  
  // Default error handling
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { 
        details: err.message, 
        stack: err.stack 
      }),
    }
  });
};

// Export all middleware
export { validation };

export default {
  requestLogger,
  errorHandler,
  validation,
};
