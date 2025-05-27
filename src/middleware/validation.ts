import { Request, Response, NextFunction } from 'express';
import { validators } from '../utils';

// Validate user creation request
export const validateUserCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email } = req.body;

  // Check if required fields are present
  if (!name || !email) {
    res.status(400).json({
      error: 'Validation Error',
      details: 'Name and email are required fields'
    });
    return;
  }

  // Validate email format
  if (!validators.isEmail(email)) {
    res.status(400).json({
      error: 'Validation Error',
      details: 'Invalid email format'
    });
    return;
  }

  // If all validations pass, continue to the next middleware
  next();
};

// Validate user update request
export const validateUserUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email } = req.body;
  
  // At least one field should be provided
  if (!name && !email) {
    res.status(400).json({
      error: 'Validation Error',
      details: 'At least one field to update is required'
    });
    return;
  }

  // If email is provided, validate its format
  if (email && !validators.isEmail(email)) {
    res.status(400).json({
      error: 'Validation Error',
      details: 'Invalid email format'
    });
    return;
  }

  // If all validations pass, continue to the next middleware
  next();
};
