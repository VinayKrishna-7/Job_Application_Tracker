import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { ApiError } from '../utils/apiError.js';

export class ApplicationService {
  static async createApplication(userId, applicationData) {
    const application = await Application.create({
      ...applicationData,
      userId,
    });
    return application;
  }

  static async listApplications(userId, queryParams = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      workMode,
      employmentType,
      source,
      tag,
      sortBy = 'dateApplied',
      sortOrder = 'desc',
    } = queryParams;

    const filter = { userId };

    if (status && status !== 'All') {
      filter.status = status;
    }
    if (priority && priority !== 'All') {
      filter.priority = priority;
    }
    if (workMode && workMode !== 'All') {
      filter.workMode = workMode;
    }
    if (employmentType && employmentType !== 'All') {
      filter.employmentType = employmentType;
    }
    if (source && source !== 'All') {
      filter.source = source;
    }
    if (tag) {
      filter.tags = tag;
    }

    if (search && search.trim() !== '') {
      const sanitizedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(sanitizedSearch, 'i');
      filter.$or = [
        { company: searchRegex },
        { position: searchRegex },
        { location: searchRegex },
        { contactName: searchRegex },
        { notes: searchRegex },
        { tags: searchRegex },
      ];
    }

    // Build sort options
    let sort = {};
    const order = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'company') {
      sort = { company: order };
    } else if (sortBy === 'priority') {
      // In mongo, if sorting by priority string, we can secondary sort by dateApplied
      sort = { priority: order, dateApplied: -1 };
    } else if (sortBy === 'updatedAt') {
      sort = { updatedAt: order };
    } else if (sortBy === 'followUpDate') {
      sort = { followUpDate: order };
    } else {
      // Default: dateApplied
      sort = { dateApplied: order, createdAt: order };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const numericLimit = Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(filter).sort(sort).skip(skip).limit(numericLimit),
      Application.countDocuments(filter),
    ]);

    return {
      applications,
      pagination: {
        page: Number(page),
        limit: numericLimit,
        total,
        totalPages: Math.ceil(total / numericLimit) || 1,
      },
    };
  }

  static async getKanbanBoard(userId) {
    const applications = await Application.find({ userId }).sort({ updatedAt: -1 });
    return applications;
  }

  static async getApplicationById(userId, applicationId) {
    const application = await Application.findOne({
      _id: applicationId,
      userId,
    });

    if (!application) {
      throw ApiError.notFound('Job application not found.', 'APPLICATION_NOT_FOUND');
    }

    // Find linked interviews
    const interviews = await Interview.find({
      applicationId: application._id,
      userId,
    }).sort({ date: 1 });

    return {
      ...application.toObject(),
      interviews,
    };
  }

  static async updateApplication(userId, applicationId, updateData) {
    // Prevent client from changing ownership
    delete updateData.userId;

    const application = await Application.findOneAndUpdate(
      { _id: applicationId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!application) {
      throw ApiError.notFound('Job application not found.', 'APPLICATION_NOT_FOUND');
    }

    return application;
  }

  static async deleteApplication(userId, applicationId) {
    const application = await Application.findOneAndDelete({
      _id: applicationId,
      userId,
    });

    if (!application) {
      throw ApiError.notFound('Job application not found.', 'APPLICATION_NOT_FOUND');
    }

    // Cascade delete associated interviews
    await Interview.deleteMany({ applicationId, userId });

    return { message: 'Application and associated records deleted successfully.' };
  }
}
