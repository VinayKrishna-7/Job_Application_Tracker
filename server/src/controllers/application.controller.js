import { ApplicationService } from '../services/application.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { storageService } from '../services/storage/index.js';
import { ApiError } from '../utils/apiError.js';

export class ApplicationController {
  static async createApplication(req, res, next) {
    try {
      const application = await ApplicationService.createApplication(req.user._id, req.body);
      return ApiResponse.created(res, { application }, 'Application created successfully');
    } catch (error) {
      next(error);
    }
  }

  static async listApplications(req, res, next) {
    try {
      const { applications, pagination } = await ApplicationService.listApplications(
        req.user._id,
        req.query
      );
      return ApiResponse.paginated(res, applications, pagination, 'Applications retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getKanbanBoard(req, res, next) {
    try {
      const applications = await ApplicationService.getKanbanBoard(req.user._id);
      return ApiResponse.success(res, { applications }, 'Kanban board applications retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getApplicationById(req, res, next) {
    try {
      const application = await ApplicationService.getApplicationById(
        req.user._id,
        req.params.id
      );
      return ApiResponse.success(res, { application }, 'Application details retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateApplication(req, res, next) {
    try {
      const application = await ApplicationService.updateApplication(
        req.user._id,
        req.params.id,
        req.body
      );
      return ApiResponse.success(res, { application }, 'Application updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteApplication(req, res, next) {
    try {
      const result = await ApplicationService.deleteApplication(
        req.user._id,
        req.params.id
      );
      return ApiResponse.success(res, result, 'Application deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async uploadResume(req, res, next) {
    try {
      if (!req.file) {
        throw ApiError.badRequest('Please upload a resume file (PDF, DOC, DOCX).', 'MISSING_FILE');
      }

      const uploadResult = await storageService.upload(req.file, {
        folder: 'easytrack/resumes',
        prefix: 'resume',
      });

      return ApiResponse.success(
        res,
        {
          url: uploadResult.url,
          filename: uploadResult.filename,
          size: uploadResult.size,
          mimetype: uploadResult.mimetype,
        },
        'Resume uploaded successfully'
      );
    } catch (error) {
      next(error);
    }
  }
}
