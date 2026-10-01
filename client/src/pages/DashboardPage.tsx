import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboardApi';
import { StatsCard } from '../components/dashboard/StatsCard';
import { TrendChart } from '../components/dashboard/TrendChart';
import { StatusChart } from '../components/dashboard/StatusChart';
import { SourceChart } from '../components/dashboard/SourceChart';
import { FollowUpWidget } from '../components/dashboard/FollowUpWidget';
import { UpcomingInterviewsWidget } from '../components/dashboard/UpcomingInterviewsWidget';
import { RecentApplications } from '../components/dashboard/RecentApplications';
import { SkeletonStats, SkeletonCard } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import {
  Briefcase,
  CalendarCheck,
  Trophy,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [trendPeriod, setTrendPeriod] = useState('30d');

  // Queries
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  });

  const trendsQuery = useQuery({
    queryKey: ['dashboard', 'trends', trendPeriod],
    queryFn: () => dashboardApi.getTrends(trendPeriod),
  });

  const statusQuery = useQuery({
    queryKey: ['dashboard', 'status'],
    queryFn: dashboardApi.getStatusDistribution,
  });

  const sourceQuery = useQuery({
    queryKey: ['dashboard', 'source'],
    queryFn: dashboardApi.getSourceDistribution,
  });

  const followUpsQuery = useQuery({
    queryKey: ['dashboard', 'followUps'],
    queryFn: dashboardApi.getFollowUps,
  });

  const interviewsQuery = useQuery({
    queryKey: ['dashboard', 'interviews'],
    queryFn: () => dashboardApi.getUpcomingInterviews(5),
  });

  const recentAppsQuery = useQuery({
    queryKey: ['dashboard', 'recentApps'],
    queryFn: () => dashboardApi.getRecentApplications(6),
  });

  const isLoading = statsQuery.isLoading;
  const isError = statsQuery.isError;

  const handleRefresh = () => {
    statsQuery.refetch();
    trendsQuery.refetch();
    statusQuery.refetch();
    sourceQuery.refetch();
    followUpsQuery.refetch();
    interviewsQuery.refetch();
    recentAppsQuery.refetch();
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to load dashboard metrics"
        message="Could not connect to the EasyTrack service. Please verify your connection."
        onRetry={handleRefresh}
      />
    );
  }

  const stats = statsQuery.data;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Overview of your job applications, interview schedules, and search progress.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      {isLoading ? (
        <SkeletonStats />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Applications"
            value={stats?.totalApplications || 0}
            description={`${stats?.appliedThisMonth || 0} submitted this month`}
            icon={<Briefcase className="w-4 h-4" />}
            iconBgColor="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400"
          />

          <StatsCard
            title="Active Interviews"
            value={stats?.interviews || 0}
            description={`${stats?.interviewRate || 0}% interview rate`}
            icon={<CalendarCheck className="w-4 h-4" />}
            iconBgColor="bg-sky-50 text-sky-600 dark:bg-sky-950/70 dark:text-sky-400"
          />

          <StatsCard
            title="Offers Received"
            value={stats?.offers || 0}
            description="Active employment offers"
            icon={<Trophy className="w-4 h-4" />}
            iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400"
          />

          <StatsCard
            title="Response Rate"
            value={`${stats?.responseRate || 0}%`}
            description="Progression past initial applied stage"
            icon={<TrendingUp className="w-4 h-4" />}
            iconBgColor="bg-violet-50 text-violet-600 dark:bg-violet-950/70 dark:text-violet-400"
          />
        </div>
      )}

      {/* Full-Width Application Velocity Trend */}
      <div>
        {trendsQuery.isLoading ? (
          <SkeletonCard />
        ) : (
          <TrendChart
            data={trendsQuery.data || []}
            period={trendPeriod}
            onPeriodChange={setTrendPeriod}
          />
        )}
      </div>

      {/* Analytics Row: Pipeline Distribution & Application Channels (2 Columns 50/50) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {statusQuery.isLoading ? (
            <SkeletonCard />
          ) : (
            <StatusChart data={statusQuery.data || []} />
          )}
        </div>

        <div>
          {sourceQuery.isLoading ? (
            <SkeletonCard />
          ) : (
            <SourceChart data={sourceQuery.data || []} />
          )}
        </div>
      </div>

      {/* Agenda Row: Upcoming Interviews & Follow-Up Reminders (2 Columns 50/50) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          {interviewsQuery.isLoading ? (
            <SkeletonCard />
          ) : (
            <UpcomingInterviewsWidget interviews={interviewsQuery.data || []} />
          )}
        </div>

        <div>
          {followUpsQuery.isLoading ? (
            <SkeletonCard />
          ) : (
            <FollowUpWidget
              data={
                followUpsQuery.data || {
                  overdue: [],
                  dueToday: [],
                  upcoming: [],
                }
              }
            />
          )}
        </div>
      </div>

      {/* Full-Width Recent Applications Table */}
      <div>
        {recentAppsQuery.isLoading ? (
          <SkeletonCard />
        ) : (
          <RecentApplications applications={recentAppsQuery.data || []} />
        )}
      </div>
    </div>
  );
};


