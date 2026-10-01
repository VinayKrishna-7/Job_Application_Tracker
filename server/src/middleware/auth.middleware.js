import { verifyToken, COOKIE_NAME } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check HTTP-only cookie first
    if (req.cookies && (req.cookies[COOKIE_NAME] || req.cookies.jobtrack_token)) {
      token = req.cookies[COOKIE_NAME] || req.cookies.jobtrack_token;
    }
    // 2. Fall back to Authorization Bearer header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Authentication required. Please log in.', 'AUTH_REQUIRED');
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw ApiError.unauthorized('Session expired. Please log in again.', 'TOKEN_EXPIRED');
      }
      throw ApiError.unauthorized('Invalid authentication token.', 'INVALID_TOKEN');
    }

    // Verify user exists in database
    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('User associated with this token no longer exists.', 'USER_NOT_FOUND');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
