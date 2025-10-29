import rateLimit from 'express-rate-limit';
import { ErrorResponse } from '../utils/common/index.js';
import { AppError } from '../utils/errors/index.js';
import logger from '../config/logger.js';

const windowMinutes = Number(process.env.RATE_LIMIT_WINDOW_MINUTES || 15);
const maxRequests = Number(process.env.RATE_LIMIT_MAX || 100);

export const rateLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res /*, next */) => {
    const response = ErrorResponse();
    response.message = 'Too many requests';
    response.error = new AppError(
      [`Rate limit exceeded. Try again later. Window: ${windowMinutes}m`],
      429
    );

    logger.warn('Rate limit exceeded', { file: 'rateLimiter.middleware.js' });
    return res.status(429).json(response);
  }
});
