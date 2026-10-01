import { Interview } from '../models/Interview.js';
import { Application } from '../models/Application.js';
import { ApiError } from '../utils/apiError.js';

export class InterviewService {
  static async createInterview(userId, interviewData) {
    // Verify that the target application exists and belongs to the user
    const application = await Application.findOne({
      _id: interviewData.applicationId,
      userId,
    });

    if (!application) {
      throw ApiError.notFound('Associated job application not found.', 'APPLICATION_NOT_FOUND');
    }

    const interview = await Interview.create({
      ...interviewData,
      userId,
    });

    // If application status is currently 'Applied' or 'Wishlist', optionally advance status to 'Interview'
    if (['Wishlist', 'Applied', 'Screening'].includes(application.status)) {
      application.status = 'Interview';
      await application.save();
    }

    const populatedInterview = await Interview.findById(interview._id).populate({
      path: 'applicationId',
      select: 'company position status location workMode',
    });

    return populatedInterview;
  }

  static async listInterviews(userId, queryParams = {}) {
    const { status, type, limit = 50 } = queryParams;
    const filter = { userId };

    if (status && status !== 'All') {
      filter.result = status;
    }
    if (type && type !== 'All') {
      filter.type = type;
    }

    const interviews = await Interview.find(filter)
      .populate({
        path: 'applicationId',
        select: 'company position status location workMode priority',
      })
      .sort({ date: 1 })
      .limit(Number(limit));

    return interviews;
  }

  static async getInterviewById(userId, interviewId) {
    const interview = await Interview.findOne({
      _id: interviewId,
      userId,
    }).populate({
      path: 'applicationId',
      select: 'company position status location workMode contactName contactEmail',
    });

    if (!interview) {
      throw ApiError.notFound('Interview not found.', 'INTERVIEW_NOT_FOUND');
    }

    return interview;
  }

  static async updateInterview(userId, interviewId, updateData) {
    delete updateData.userId;
    delete updateData.applicationId; // Prevent reassigning application

    const interview = await Interview.findOneAndUpdate(
      { _id: interviewId, userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate({
      path: 'applicationId',
      select: 'company position status location workMode',
    });

    if (!interview) {
      throw ApiError.notFound('Interview not found.', 'INTERVIEW_NOT_FOUND');
    }

    return interview;
  }

  static async deleteInterview(userId, interviewId) {
    const interview = await Interview.findOneAndDelete({
      _id: interviewId,
      userId,
    });

    if (!interview) {
      throw ApiError.notFound('Interview not found.', 'INTERVIEW_NOT_FOUND');
    }

    return { message: 'Interview deleted successfully.' };
  }
}
