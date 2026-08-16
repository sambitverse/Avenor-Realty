import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';

/**
 * 404 Route Not Found Handler
 */
export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Endpoint ${req.method} ${req.originalUrl} not found`, 'ROUTE_NOT_FOUND'));
};

/**
 * Centralized Error Handling Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, normalize it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500;
    const message = error.message || 'Internal Server Error';
    const code = error.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');
    error = new ApiError(statusCode, message, code, error.errors || []);
  }

  // Structured logging (sanitized)
  logger.error(error.message, {
    statusCode: error.statusCode,
    code: error.code,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    errors: error.errors
  });

  const isProduction = process.env.NODE_ENV === 'production';

  const responsePayload = {
    success: false,
    message: error.message,
    code: error.code || 'ERROR',
    errors: error.errors && error.errors.length > 0 ? error.errors : undefined
  };

  // Only include stack traces in non-production environments
  if (!isProduction && error.stack) {
    responsePayload.stack = error.stack;
  }

  return res.status(error.statusCode || 500).json(responsePayload);
};
