import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Protect middleware: Requires valid JWT token on protected routes.
 * Strictly returns 401 Unauthorized if token is missing, expired, or invalid.
 * NEVER falls back to guest user on protected routes.
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication required. Please provide a valid token.', 'AUTH_REQUIRED'));
    }

    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.id || decoded.sub,
        email: decoded.email,
        role: decoded.role || 'User',
        name: decoded.name || decoded.full_name || 'User'
      };
      return next();
    } catch (err) {
      const isExpired = err.name === 'TokenExpiredError';
      const message = isExpired ? 'Authentication token has expired' : 'Invalid authentication token';
      const code = isExpired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
      return next(new ApiError(401, message, code));
    }
  } catch (error) {
    return next(new ApiError(401, 'Authentication failed', 'AUTH_FAILED'));
  }
};

/**
 * Optional protect middleware: Attaches user context if a valid token is provided,
 * but allows unauthenticated public requests to pass through cleanly without errors.
 */
export const optionalProtect = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = {
          id: decoded.id || decoded.sub,
          email: decoded.email,
          role: decoded.role || 'User',
          name: decoded.name || decoded.full_name || 'User'
        };
      } catch (err) {
        req.user = null;
      }
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }
  return next();
};

/**
 * Authorize middleware: Enforces Role-Based Access Control (RBAC).
 * Strictly returns 403 Forbidden if the authenticated user lacks the required role.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required before authorization check', 'AUTH_REQUIRED'));
    }

    const normalizedUserRole = (req.user.role || '').toLowerCase();
    const normalizedAllowedRoles = roles.map(r => r.toLowerCase());

    if (roles.length > 0 && !normalizedAllowedRoles.includes(normalizedUserRole)) {
      return next(
        new ApiError(
          403,
          `Access denied. Role '${req.user.role}' is not authorized to perform this operation.`,
          'FORBIDDEN'
        )
      );
    }

    return next();
  };
};
