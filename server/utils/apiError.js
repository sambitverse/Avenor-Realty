/**
 * Standardized API Error class for consistent backend error responses.
 */
export class ApiError extends Error {
  constructor(statusCode = 500, message = 'An unexpected error occurred', code = 'INTERNAL_ERROR', errors = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Invalid request parameters', code = 'BAD_REQUEST', errors = []) {
    return new ApiError(400, message, code, errors);
  }

  static unauthorized(message = 'Authentication required', code = 'UNAUTHORIZED', errors = []) {
    return new ApiError(401, message, code, errors);
  }

  static forbidden(message = 'Insufficient permissions to access this resource', code = 'FORBIDDEN', errors = []) {
    return new ApiError(403, message, code, errors);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND', errors = []) {
    return new ApiError(404, message, code, errors);
  }

  static conflict(message = 'Resource conflict or duplicate entry', code = 'CONFLICT', errors = []) {
    return new ApiError(409, message, code, errors);
  }

  static internal(message = 'Internal server error', code = 'INTERNAL_SERVER_ERROR', errors = []) {
    return new ApiError(500, message, code, errors);
  }
}

/**
 * Async handler wrapper to catch unhandled promise rejections and pass to Next()
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
