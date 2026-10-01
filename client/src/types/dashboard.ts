import { JobApplication } from './application';
import { Interview } from './interview';

export interface DashboardStats {
  totalApplications: number;
  appliedThisMonth: number;
  activeApplications: number;
  interviews: number;
  offers: number;
  rejected: number;
  responseRate: number;
  interviewRate: number;
}

export interface TrendDataPoint {
  date: string;
  count: number;
}

export interface StatusDistributionItem {
  status: string;
  count: number;
}

export interface SourceDistributionItem {
  source: string;
  count: number;
}

export interface WorkModeDistributionItem {
  workMode: string;
  count: number;
}

export interface FollowUpsData {
  overdue: JobApplication[];
  dueToday: JobApplication[];
  upcoming: JobApplication[];
}
