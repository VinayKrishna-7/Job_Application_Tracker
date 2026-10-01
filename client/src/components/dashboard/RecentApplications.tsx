import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { JobApplication } from '../../types/application';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatDate } from '../../utils/formatters';
import { Briefcase, ChevronRight } from 'lucide-react';

interface RecentApplicationsProps {
  applications: JobApplication[];
}

export const RecentApplications: React.FC<RecentApplicationsProps> = ({
  applications,
}) => {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
              Recent Application Activity
            </CardTitle>
            {applications.length > 0 && (
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                {applications.length}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Latest additions and updates in your job pipeline
          </p>
        </div>
        <Link
          to="/applications"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          View all applications &rarr;
        </Link>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto max-h-96">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-gray-400">
            <Briefcase className="w-8 h-8 mb-2 text-gray-300 dark:text-gray-600" />
            <p className="font-semibold text-gray-600 dark:text-gray-300">
              No applications logged yet
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Click &ldquo;Log Application&rdquo; to add your first job opportunity.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {applications.map((app) => {
              const initial = app.company.charAt(0).toUpperCase() || 'J';
              return (
                <Link
                  key={app._id}
                  to={`/applications/${app._id}`}
                  className="flex items-center justify-between py-3 px-2.5 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 rounded-xl group transition-all duration-150"
                >
                  <div className="min-w-0 flex-1 pr-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center font-black text-xs text-indigo-700 dark:text-indigo-300 shrink-0">
                      {initial}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate transition-colors">
                          {app.company}
                        </span>
                        <PriorityBadge priority={app.priority} />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {app.position} &bull; {app.location || 'Remote'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={app.status} size="sm" />
                    <span className="text-xs font-medium text-gray-400 hidden sm:inline">
                      {formatDate(app.dateApplied)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 dark:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

