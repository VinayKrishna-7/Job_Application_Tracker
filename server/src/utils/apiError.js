export class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', code = 'INTERNAL_ERROR', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = 'Bad Request', code = 'BAD_REQUEST', errors = []) {
    return new ApiError(400, message, code, errors);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new ApiError(401, message, code);
  }

  static forbidden(message = 'Forbidden: Access Denied', code = 'FORBIDDEN') {
    return new ApiError(403, message, code);
  }

  static notFound(message = 'Resource not found', code = 'NOT_FOUND') {
    return new ApiError(404, message, code);
  }

  static conflict(message = 'Resource conflict', code = 'CONFLICT') {
    return new ApiError(409, message, code);
  }

  static unprocessable(message = 'Unprocessable entity', code = 'VALIDATION_ERROR', errors = []) {
    return new ApiError(422, message, code, errors);
  }

  static internal(message = 'Internal server error', code = 'INTERNAL_SERVER_ERROR') {
    return new ApiError(500, message, code);
  }
}
