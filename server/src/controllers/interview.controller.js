import { InterviewService } from '../services/interview.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class InterviewController {
  static async createInterview(req, res, next) {
    try {
      const interview = await InterviewService.createInterview(req.user._id, req.body);
      return ApiResponse.created(res, { interview }, 'Interview scheduled successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listInterviews(req, res, next) {
    try {
      const interviews = await InterviewService.listInterviews(req.user._id, req.query);
      return ApiResponse.success(res, { interviews }, 'Interviews retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getInterviewById(req, res, next) {
    try {
      const interview = await InterviewService.getInterviewById(req.user._id, req.params.id);
      return ApiResponse.success(res, { interview }, 'Interview retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateInterview(req, res, next) {
    try {
      const interview = await InterviewService.updateInterview(
        req.user._id,
        req.params.id,
        req.body
      );
      return ApiResponse.success(res, { interview }, 'Interview updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteInterview(req, res, next) {
    try {
      const result = await InterviewService.deleteInterview(req.user._id, req.params.id);
      return ApiResponse.success(res, result, 'Interview deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
