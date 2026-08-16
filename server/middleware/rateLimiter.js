import rateLimit from 'express-rate-limit';

const standardResponseHandler = (message, code) => (req, res) => {
  res.status(429).json({
    success: false,
    message,
    code,
    retryAfter: res.getHeader('Retry-After') || '15 minutes'
  });
};

/**
 * Strict rate limiting for authentication routes (login, register, password reset)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 auth attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: standardResponseHandler(
    'Too many authentication attempts. Please try again after 15 minutes.',
    'RATE_LIMIT_EXCEEDED'
  )
});

/**
 * General API rate limiting for public and general endpoints
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: standardResponseHandler(
    'Too many requests to the API. Please slow down.',
    'RATE_LIMIT_EXCEEDED'
  )
});

/**
 * Contact / Appointment inquiries rate limiter to prevent spam
 */
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: standardResponseHandler(
    'Too many inquiry submissions. Please try again shortly.',
    'RATE_LIMIT_EXCEEDED'
  )
});

/**
 * Mutation rate limiter for creating/updating properties and listings
 */
export const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  handler: standardResponseHandler(
    'Action rate limit reached for resource creation.',
    'RATE_LIMIT_EXCEEDED'
  )
});
