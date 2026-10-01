import { ApiError } from '../utils/apiError.js';

export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error.errors) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return next(
          ApiError.unprocessable(
            validationErrors[0]?.message || 'Validation error',
            'VALIDATION_ERROR',
            validationErrors
          )
        );
      }
      next(error);
    }
  };
};
