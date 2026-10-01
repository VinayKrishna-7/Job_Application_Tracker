import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Interview } from '../../types/interview';
import { formatDateTime } from '../../utils/formatters';
import { CalendarCheck, Video, User, ExternalLink, Calendar } from 'lucide-react';

interface UpcomingInterviewsWidgetProps {
  interviews: Interview[];
}

export const UpcomingInterviewsWidget: React.FC<UpcomingInterviewsWidgetProps> = ({
  interviews,
}) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
              Upcoming Interviews
            </CardTitle>
            {interviews.length > 0 && (
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                {interviews.length}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Confirmed calendar rounds & discussions
          </p>
        </div>
        <Link
          to="/interviews"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          View calendar &rarr;
        </Link>
      </CardHeader>

      <CardContent className="h-72 overflow-y-auto">

        {interviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-gray-400">
            <Calendar className="w-8 h-8 mb-2 text-gray-300 dark:text-gray-600" />
            <p className="font-semibold text-gray-600 dark:text-gray-300">
              No interviews scheduled
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              When recruiters book time with you, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {interviews.map((int) => {
              const app = typeof int.applicationId === 'object' ? int.applicationId : null;

              return (
                <div
                  key={int._id}
                  className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 dark:border-gray-800/80 dark:bg-gray-800/40 hover:border-indigo-300/70 dark:hover:border-indigo-700/60 transition-all duration-150"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      {app && (
                        <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider truncate">
                          {app.company}
                        </p>
                      )}
                      <h5 className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate">
                        Round {int.round}: {int.type}
                      </h5>
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-200/80 dark:border-gray-700 shadow-2xs">
                      {formatDateTime(int.date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 mt-1 border-t border-gray-100/80 dark:border-gray-800/60">
                    {int.interviewer ? (
                      <span className="flex items-center gap-1.5 text-[11px] truncate pr-2">
                        <User className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="truncate">{int.interviewer}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">Team Panel</span>
                    )}

                    {int.meetingUrl ? (
                      <a
                        href={int.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700 transition-colors shadow-2xs"
                      >
                        <Video className="w-3 h-3" />
                        Join Call
                      </a>
                    ) : (
                      <Link
                        to={`/applications/${app?._id || ''}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        Details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

