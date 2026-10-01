import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { setAuthCookie, clearAuthCookie } from '../utils/jwt.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const { user, token } = await AuthService.register(req.body);
      setAuthCookie(res, token);
      return ApiResponse.created(res, { user, token }, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { user, token } = await AuthService.login(req.body);
      setAuthCookie(res, token);
      return ApiResponse.success(res, { user, token }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      clearAuthCookie(res);
      return ApiResponse.success(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await AuthService.getMe(req.user._id);
      return ApiResponse.success(res, { user }, 'Current user profile');
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const result = await AuthService.requestPasswordReset(req.body.email);
      return ApiResponse.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const result = await AuthService.resetPassword(token, password);
      return ApiResponse.success(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }
}
