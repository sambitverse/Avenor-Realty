import { ApiError } from '../utils/apiError.js';

/**
 * Higher-order middleware function to validate request payload against a Zod schema.
 * Supports validating 'body', 'query', or 'params'.
 */
export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const parsed = await schema.parseAsync(dataToValidate);
      req[source] = parsed; // attach sanitized & typed data back
      return next();
    } catch (err) {
      if (err.errors) {
        const formattedErrors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return next(
          new ApiError(400, 'Request validation failed', 'VALIDATION_ERROR', formattedErrors)
        );
      }
      return next(new ApiError(400, err.message || 'Invalid request data', 'VALIDATION_ERROR'));
    }
  };
};
