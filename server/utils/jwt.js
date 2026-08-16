import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates and retrieves the JWT secret from environment variables.
 * Fails safely with an explicit error if missing.
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
};

export const getJwtRefreshSecret = () => {
  return process.env.JWT_REFRESH_SECRET || getJwtSecret();
};

/**
 * Generates an Access Token with standard payload.
 */
export const generateAccessToken = (payload) => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Generates a Refresh Token.
 */
export const generateRefreshToken = (payload) => {
  const secret = getJwtRefreshSecret();
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
  return jwt.sign(payload, secret, { expiresIn });
};

/**
 * Verifies an Access Token. Throws error if invalid or expired.
 */
export const verifyAccessToken = (token) => {
  if (!token) {
    throw new Error('Token is required for verification');
  }
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

/**
 * Verifies a Refresh Token.
 */
export const verifyRefreshToken = (token) => {
  if (!token) {
    throw new Error('Refresh token is required for verification');
  }
  const secret = getJwtRefreshSecret();
  return jwt.verify(token, secret);
};
