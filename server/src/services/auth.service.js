import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { generateToken, verifyToken } from '../utils/jwt.js';

export class AuthService {
  static async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists.', 'EMAIL_EXISTS');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken({ id: user._id });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized(
        'No account found with this email address. Please check your spelling or register a new account.',
        'USER_NOT_FOUND'
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized(
        'Incorrect password for this account. Please verify your password or use "Forgot password?" to reset it.',
        'INCORRECT_PASSWORD'
      );
    }


    const token = generateToken({ id: user._id });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        title: user.title,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        phone: user.phone,
        linkedIn: user.linkedIn,
        gitHub: user.gitHub,
        portfolio: user.portfolio,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  static async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User account not found.', 'USER_NOT_FOUND');
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      title: user.title,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
      linkedIn: user.linkedIn,
      gitHub: user.gitHub,
      portfolio: user.portfolio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async updateProfile(userId, updateData) {
    // Prevent updating email or password through profile route
    delete updateData.email;
    delete updateData.password;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw ApiError.notFound('User account not found.', 'USER_NOT_FOUND');
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      title: user.title,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      phone: user.phone,
      linkedIn: user.linkedIn,
      gitHub: user.gitHub,
      portfolio: user.portfolio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async requestPasswordReset(email) {
    const user = await User.findOne({ email });
    // Generic response regardless of whether email exists to prevent enumeration
    if (!user) {
      return { message: 'If that email address exists, a reset link has been dispatched.' };
    }

    const resetToken = generateToken({ id: user._id, type: 'password-reset' });
    return {
      message: 'If that email address exists, a reset link has been dispatched.',
      // For local development and testing convenience, return reset token
      devResetToken: resetToken,
    };
  }

  static async resetPassword(token, newPassword) {
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      throw ApiError.badRequest('Password reset token is invalid or has expired.', 'INVALID_RESET_TOKEN');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw ApiError.notFound('User account not found.', 'USER_NOT_FOUND');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password has been reset successfully. Please log in with your new password.' };
  }
}
