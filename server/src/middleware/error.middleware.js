import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid format for field '${err.path}': '${err.value}'`;
    error = ApiError.badRequest(message, 'INVALID_ID');
  }

  // Handle Mongo Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `A record with this ${field} already exists`;
    error = ApiError.conflict(message, 'DUPLICATE_KEY');
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.unprocessable('Validation failed', 'VALIDATION_ERROR', errors);
  }

  // Handle Multer Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = ApiError.badRequest('File size exceeds the permitted limit (5MB max)', 'FILE_TOO_LARGE');
    } else {
      error = ApiError.badRequest(`File upload error: ${err.message}`, 'UPLOAD_ERROR');
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authorization token', 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Authorization token has expired', 'TOKEN_EXPIRED');
  }

  // If error is not an instance of ApiError, convert to 500 ApiError
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  const errors = error.errors || [];

  if (statusCode === 500 && !env.isProduction) {
    console.error('[Unhandled Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(errors.length > 0 && { errors }),
    ...(!env.isProduction && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Cannot ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
};
