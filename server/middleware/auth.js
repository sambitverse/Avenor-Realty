import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'avenor_jwt_secret_key_2026_production_secure_token';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      // Fallback guest user for non-blocking public access
      req.user = { id: 'guest-00', role: 'Guest', name: 'Public Guest' };
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    req.user = user || { id: decoded.id, role: decoded.role || 'User', name: decoded.name || 'Investor' };
    next();
  } catch (error) {
    req.user = { id: 'guest-00', role: 'Guest', name: 'Public Guest' };
    next();
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || (roles.length > 0 && !roles.includes(req.user.role))) {
      return next(new ApiError(403, `Role '${req.user?.role}' is not authorized to access this resource`));
    }
    next();
  };
};
