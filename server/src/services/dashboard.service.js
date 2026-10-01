import mongoose from 'mongoose';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';

export class DashboardService {
  static async getStats(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalApplications,
      appliedThisMonth,
      interviewCount,
      offerCount,
      rejectedCount,
      screeningsCount,
    ] = await Promise.all([
      Application.countDocuments({ userId: userObjectId }),
      Application.countDocuments({
        userId: userObjectId,
        dateApplied: { $gte: startOfMonth },
      }),
      Interview.countDocuments({ userId: userObjectId }),
      Application.countDocuments({ userId: userObjectId, status: 'Offer' }),
      Application.countDocuments({ userId: userObjectId, status: 'Rejected' }),
      Application.countDocuments({
        userId: userObjectId,
        status: { $in: ['Screening', 'Interview', 'Technical Round'] },
      }),
    ]);

    // Active applications (not rejected or withdrawn)
    const activeApplications = await Application.countDocuments({
      userId: userObjectId,
      status: { $nin: ['Rejected', 'Withdrawn'] },
    });

    // Response rate: proportion that moved beyond "Applied" and "Wishlist"
    const progressedApplications = await Application.countDocuments({
      userId: userObjectId,
      status: { $in: ['Screening', 'Interview', 'Technical Round', 'Offer', 'Rejected'] },
    });

    const responseRate = totalApplications > 0
      ? Math.round((progressedApplications / totalApplications) * 100)
      : 0;

    const interviewRate = totalApplications > 0
      ? Math.round(((interviewCount + screeningsCount) / totalApplications) * 100)
      : 0;

    return {
      totalApplications,
      appliedThisMonth,
      activeApplications,
      interviews: interviewCount,
      offers: offerCount,
      rejected: rejectedCount,
      responseRate,
      interviewRate,
    };
  }

  static async getApplicationTrends(userId, period = '30d') {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    let startDate = new Date();

    if (period === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === '90d') {
      startDate.setDate(now.getDate() - 90);
    } else if (period === '1y') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      // Default 30d
      startDate.setDate(now.getDate() - 30);
    }

    const trends = await Application.aggregate([
      {
        $match: {
          userId: userObjectId,
          dateApplied: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$dateApplied' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in dates for complete timeline
    const dateMap = new Map();
    trends.forEach((item) => {
      dateMap.set(item._id, item.count);
    });

    const result = [];
    const curr = new Date(startDate);
    while (curr <= now) {
      const dateStr = curr.toISOString().split('T')[0];
      result.push({
        date: dateStr,
        count: dateMap.get(dateStr) || 0,
      });
      curr.setDate(curr.getDate() + 1);
    }

    return result;
  }

  static async getStatusDistribution(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const distribution = await Application.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return distribution.map((item) => ({
      status: item._id,
      count: item.count,
    }));
  }

  static async getSourceDistribution(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const distribution = await Application.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return distribution.map((item) => ({
      source: item._id || 'Unknown',
      count: item.count,
    }));
  }

  static async getWorkModeDistribution(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const distribution = await Application.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: '$workMode',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return distribution.map((item) => ({
      workMode: item._id || 'Remote',
      count: item.count,
    }));
  }

  static async getFollowUps(userId) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [overdue, dueToday, upcoming] = await Promise.all([
      // Overdue: followUpDate < startOfToday
      Application.find({
        userId,
        followUpDate: { $ne: null, $lt: startOfToday },
        status: { $nin: ['Offer', 'Rejected', 'Withdrawn'] },
      })
        .select('company position status priority followUpDate')
        .sort({ followUpDate: 1 })
        .limit(10),

      // Due Today: followUpDate between startOfToday and endOfToday
      Application.find({
        userId,
        followUpDate: { $gte: startOfToday, $lte: endOfToday },
        status: { $nin: ['Offer', 'Rejected', 'Withdrawn'] },
      })
        .select('company position status priority followUpDate')
        .sort({ followUpDate: 1 })
        .limit(10),

      // Upcoming: followUpDate > endOfToday
      Application.find({
        userId,
        followUpDate: { $gt: endOfToday },
        status: { $nin: ['Offer', 'Rejected', 'Withdrawn'] },
      })
        .select('company position status priority followUpDate')
        .sort({ followUpDate: 1 })
        .limit(10),
    ]);

    return {
      overdue,
      dueToday,
      upcoming,
    };
  }

  static async getUpcomingInterviews(userId, limit = 5) {
    const now = new Date();
    const interviews = await Interview.find({
      userId,
      date: { $gte: now },
      result: 'Scheduled',
    })
      .populate({
        path: 'applicationId',
        select: 'company position location workMode status',
      })
      .sort({ date: 1 })
      .limit(limit);

    return interviews;
  }

  static async getRecentApplications(userId, limit = 6) {
    const applications = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return applications;
  }
}
