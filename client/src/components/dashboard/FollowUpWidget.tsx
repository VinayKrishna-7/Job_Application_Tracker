import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { FollowUpsData } from '../../types/dashboard';
import { getDaysRemaining } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { Calendar, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';

interface FollowUpWidgetProps {
  data: FollowUpsData;
}

export const FollowUpWidget: React.FC<FollowUpWidgetProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'overdue' | 'dueToday' | 'upcoming'>('dueToday');

  const totalFollowUps = data.overdue.length + data.dueToday.length + data.upcoming.length;

  const tabs = [
    {
      key: 'overdue' as const,
      label: 'Overdue',
      count: data.overdue.length,
      badgeBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300',
    },
    {
      key: 'dueToday' as const,
      label: 'Due Today',
      count: data.dueToday.length,
      badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
    },
    {
      key: 'upcoming' as const,
      label: 'Upcoming',
      count: data.upcoming.length,
      badgeBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300',
    },
  ];

  const currentList = data[activeTab] || [];

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
              Follow-Up Agenda
            </CardTitle>
            {totalFollowUps > 0 && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
                {totalFollowUps}
              </span>
            )}
          </div>
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Critical recruiter check-ins & status touches
        </p>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-bold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-xs dark:bg-gray-900 dark:text-gray-100'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${tab.badgeBg}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-72 overflow-y-auto">

        {currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-gray-400">
            <CheckCircle2 className="w-8 h-8 mb-2 text-emerald-400/80" />
            <p className="font-semibold text-gray-600 dark:text-gray-300">
              All caught up!
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              No applications in the {tabs.find((t) => t.key === activeTab)?.label.toLowerCase()} queue.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {currentList.map((app) => {
              const followUp = getDaysRemaining(app.followUpDate);
              return (
                <Link
                  key={app._id}
                  to={`/applications/${app._id}`}
                  className="flex items-center justify-between py-2.5 px-2 group hover:bg-gray-50/80 dark:hover:bg-gray-800/40 rounded-lg transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                        {app.company}
                      </span>
                      <StatusBadge status={app.status} size="sm" showIcon={false} />
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {app.position}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`text-xs font-bold ${
                        followUp.isOverdue
                          ? 'text-rose-600 dark:text-rose-400'
                          : followUp.isToday
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {followUp.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-600 dark:text-gray-600" />
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

