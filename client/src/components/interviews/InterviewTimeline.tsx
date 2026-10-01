import React from 'react';
import { Interview } from '../../types/interview';
import { formatDateTime } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Calendar,
  Video,
  User,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';

interface InterviewTimelineProps {
  interviews: Interview[];
  onAddInterview: () => void;
  onEditInterview: (interview: Interview) => void;
}

export const InterviewTimeline: React.FC<InterviewTimelineProps> = ({
  interviews,
  onAddInterview,
  onEditInterview,
}) => {
  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Interview Process & Rounds
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {interviews.length} round{interviews.length === 1 ? '' : 's'} recorded
          </p>
        </div>
        <Button size="sm" onClick={onAddInterview}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Schedule Interview
        </Button>
      </div>

      {interviews.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-400">
          No interviews scheduled yet. Click "Schedule Interview" to log your first round.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
          {interviews.map((interview) => {
            const isPassed = interview.result === 'Passed';
            const isFailed = interview.result === 'Failed';
            const isScheduled = interview.result === 'Scheduled';

            return (
              <div key={interview._id} className="relative group">
                {/* Timeline Node */}
                <div
                  className={`absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-900 ${
                    isPassed
                      ? 'bg-emerald-500 text-white'
                      : isFailed
                      ? 'bg-rose-500 text-white'
                      : isScheduled
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-400 text-white'
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : isFailed ? (
                    <XCircle className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                </div>

                {/* Content Card */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800/80 dark:bg-gray-800/40 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        Round {interview.round}: {interview.type}
                      </span>
                      <Badge
                        variant={
                          isPassed
                            ? 'success'
                            : isFailed
                            ? 'danger'
                            : isScheduled
                            ? 'primary'
                            : 'default'
                        }
                        size="sm"
                      >
                        {interview.result}
                      </Badge>
                    </div>

                    <button
                      onClick={() => onEditInterview(interview)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 self-start sm:self-auto"
                    >
                      Edit details
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{formatDateTime(interview.date)}</span>
                    </div>

                    {interview.interviewer && (
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>With: {interview.interviewer}</span>
                      </div>
                    )}

                    {interview.meetingUrl && (
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={interview.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Join Meeting Call
                        </a>
                      </div>
                    )}

                    {interview.notes && (
                      <p className="mt-2 text-xs bg-white dark:bg-gray-900/60 p-2.5 rounded-lg border border-gray-200/50 dark:border-gray-800 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {interview.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
