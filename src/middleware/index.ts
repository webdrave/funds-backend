import { Request, Response, NextFunction } from 'express';
import * as validation from './validation';
import jwt from 'jsonwebtoken';
import { Admin } from '../models';

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

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    // Fetch user from MongoDB and attach to req.user
    const user = await Admin.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token user' });
    }
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Superadmin authorization middleware
export const requireSuperadmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== 'SUPERADMIN') {
    return res.status(403).json({ error: 'Forbidden: Superadmin only' });
  }
  next();
};
export const requireDSA = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== 'SUPERADMIN'&&user.role !=='DSA') {
    return res.status(403).json({ error: 'Forbidden: Superadmin or DSA only' });
  }
  next();
};

// Export all middleware
export { validation };

export default {
  requestLogger,
  errorHandler,
  authenticate,
  requireSuperadmin,
  requireDSA,
  validation,
};
