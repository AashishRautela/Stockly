import { ErrorResponse } from '../utils/common/index.js';
import { AppError } from '../utils/errors/index.js';
import logger from '../config/logger.js';

export const notFoundHandler = (req, res, next) => {
  const response = ErrorResponse();
  response.message = 'Route Not Found';
  response.error = new AppError(
    [`Route ${req.method} ${req.path} not found`],
    404
  );
  return res.status(404).json(response);
};

export const globalErrorHandler = (err, req, res, next) => {
  const response = ErrorResponse();

  if (err instanceof AppError) {
    response.message = err.message || 'Application Error';
    response.error = new AppError(
      Array.isArray(err.explanation)
        ? err.explanation
        : [err.explanation || err.message],
      err.statusCode || 500
    );
    const status = err.statusCode || 500;
    const logMeta = {
      statusCode: status,
      explanation: response.error.explanation,
      file: 'errorHandler.middleware.js'
    };
    if (status >= 500) logger.error(err.message, logMeta);
    else logger.warn(err.message, logMeta);
    return res.status(status).json(response);
  }

  response.message = 'Internal Server Error';
  response.error = new AppError(
    [err?.message || 'Unexpected error occurred'],
    500
  );
  logger.error(err?.message || 'Unexpected error occurred', {
    statusCode: 500,
    file: 'errorHandler.middleware.js'
  });
  return res.status(500).json(response);
};
