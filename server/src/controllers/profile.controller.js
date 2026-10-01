import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { storageService } from '../services/storage/index.js';
import { ApiError } from '../utils/apiError.js';

export class ProfileController {
  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getMe(req.user._id);
      return ApiResponse.success(res, { user }, 'User profile retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const user = await AuthService.updateProfile(req.user._id, req.body);
      return ApiResponse.success(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async uploadAvatar(req, res, next) {
    try {
      if (!req.file) {
        throw ApiError.badRequest('Please upload an image file.', 'MISSING_FILE');
      }

      const uploadResult = await storageService.upload(req.file, {
        folder: 'easytrack/avatars',
        prefix: 'avatar',
      });

      const updatedUser = await AuthService.updateProfile(req.user._id, {
        avatar: uploadResult.url,
      });

      return ApiResponse.success(
        res,
        {
          user: updatedUser,
          avatarUrl: uploadResult.url,
        },
        'Avatar uploaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}
