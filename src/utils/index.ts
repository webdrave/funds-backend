/**
 * Utility functions for the Express application
 */
import errors from './errors';

// Generate a random ID (useful for our in-memory store)
export const generateId = (length = 10): string => {
  return Math.random().toString(36).substring(2, 2 + length);
};

// Format a date to ISO string
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

// Validation utilities
export const validators = {
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  isStrongPassword: (password: string): boolean => {
    // At least 8 characters, one uppercase, one lowercase, one number, one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },
};

// Response helper functions
export const responseHelpers = {
  success: <T>(data: T, message = 'Success') => {
    return {
      success: true,
      message,
      data,
    };
  },
  
  error: (message = 'An error occurred', code = 500, errors = []) => {
    return {
      success: false,
      message,
      code,
      errors,
    };
  },
};

// Export errors
export { errors };

export default {
  generateId,
  formatDate,
  validators,
  responseHelpers,
  errors,
};
