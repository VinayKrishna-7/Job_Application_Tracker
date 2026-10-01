import api from './api';
import {
  DashboardStats,
  TrendDataPoint,
  StatusDistributionItem,
  SourceDistributionItem,
  WorkModeDistributionItem,
  FollowUpsData,
} from '../types/dashboard';
import { JobApplication } from '../types/application';
import { Interview } from '../types/interview';

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/dashboard/stats');
    return res.data.data;
  },

  getTrends: async (period = '30d'): Promise<TrendDataPoint[]> => {
    const res = await api.get('/dashboard/application-trends', {
      params: { period },
    });
    return res.data.data;
  },

  getStatusDistribution: async (): Promise<StatusDistributionItem[]> => {
    const res = await api.get('/dashboard/status-distribution');
    return res.data.data;
  },

  getSourceDistribution: async (): Promise<SourceDistributionItem[]> => {
    const res = await api.get('/dashboard/source-distribution');
    return res.data.data;
  },

  getWorkModeDistribution: async (): Promise<WorkModeDistributionItem[]> => {
    const res = await api.get('/dashboard/work-mode-distribution');
    return res.data.data;
  },

  getFollowUps: async (): Promise<FollowUpsData> => {
    const res = await api.get('/dashboard/follow-ups');
    return res.data.data;
  },

  getUpcomingInterviews: async (limit = 5): Promise<Interview[]> => {
    const res = await api.get('/dashboard/upcoming-interviews', {
      params: { limit },
    });
    return res.data.data;
  },

  getRecentApplications: async (limit = 6): Promise<JobApplication[]> => {
    const res = await api.get('/dashboard/recent-applications', {
      params: { limit },
    });
    return res.data.data;
  },
};
