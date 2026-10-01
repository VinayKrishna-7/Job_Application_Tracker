import { DashboardService } from '../services/dashboard.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class DashboardController {
  static async getStats(req, res, next) {
    try {
      const stats = await DashboardService.getStats(req.user._id);
      return ApiResponse.success(res, stats, 'Dashboard stats retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getApplicationTrends(req, res, next) {
    try {
      const period = req.query.period || '30d';
      const trends = await DashboardService.getApplicationTrends(req.user._id, period);
      return ApiResponse.success(res, trends, 'Application trends retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getStatusDistribution(req, res, next) {
    try {
      const distribution = await DashboardService.getStatusDistribution(req.user._id);
      return ApiResponse.success(res, distribution, 'Status distribution retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getSourceDistribution(req, res, next) {
    try {
      const distribution = await DashboardService.getSourceDistribution(req.user._id);
      return ApiResponse.success(res, distribution, 'Source distribution retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getWorkModeDistribution(req, res, next) {
    try {
      const distribution = await DashboardService.getWorkModeDistribution(req.user._id);
      return ApiResponse.success(res, distribution, 'Work mode distribution retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getFollowUps(req, res, next) {
    try {
      const followUps = await DashboardService.getFollowUps(req.user._id);
      return ApiResponse.success(res, followUps, 'Follow-up reminders retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getUpcomingInterviews(req, res, next) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 5;
      const interviews = await DashboardService.getUpcomingInterviews(req.user._id, limit);
      return ApiResponse.success(res, interviews, 'Upcoming interviews retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getRecentApplications(req, res, next) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const applications = await DashboardService.getRecentApplications(req.user._id, limit);
      return ApiResponse.success(res, applications, 'Recent applications retrieved');
    } catch (error) {
      next(error);
    }
  }
}
