import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'avenor_jwt_secret_key_2026_production_secure_token';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'avenor_refresh_secret_key_2026_super_secure';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};
