import React from 'react';
import { Link } from 'react-router-dom';
import { JobApplication } from '../../types/application';
import { Card } from '../ui/Card';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatDate, formatSalaryRange, getDaysRemaining } from '../../utils/formatters';
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ExternalLink,
  ChevronRight,
  Briefcase,
} from 'lucide-react';

interface ApplicationCardProps {
  application: JobApplication;
  onDelete?: (id: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const followUpInfo = application.followUpDate
    ? getDaysRemaining(application.followUpDate)
    : null;

  return (
    <Card className="hover:border-indigo-300 dark:hover:border-indigo-800 transition-all hover:shadow-md group">
      <div className="p-5 flex flex-col justify-between h-full space-y-4">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <Link to={`/applications/${application._id}`}>{application.company}</Link>
              </h3>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                {application.position}
              </p>
            </div>
            <StatusBadge status={application.status} size="sm" />
          </div>

          {/* Details list */}
          <div className="space-y-1.5 pt-1 text-xs text-gray-500 dark:text-gray-400">
            {application.location && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">
                  {application.location} ({application.workMode})
                </span>
              </div>
            )}

            {(application.salaryMin || application.salaryMax) && (
              <div className="flex items-center gap-1.5 truncate">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>
                  {formatSalaryRange(
                    application.salaryMin,
                    application.salaryMax,
                    application.currency
                  )}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>Applied {formatDate(application.dateApplied)}</span>
            </div>

            {followUpInfo && (
              <div className="flex items-center gap-1.5">
                <Clock
                  className={`w-3.5 h-3.5 shrink-0 ${
                    followUpInfo.isOverdue
                      ? 'text-rose-500'
                      : followUpInfo.isToday
                      ? 'text-amber-500'
                      : 'text-indigo-500'
                  }`}
                />
                <span
                  className={`font-medium ${
                    followUpInfo.isOverdue
                      ? 'text-rose-600 dark:text-rose-400'
                      : followUpInfo.isToday
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  Follow-up: {followUpInfo.label} ({formatDate(application.followUpDate)})
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {application.tags && application.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {application.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
              {application.tags.length > 3 && (
                <span className="text-[10px] text-gray-400 self-center">
                  +{application.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <PriorityBadge priority={application.priority} size="sm" />

          <div className="flex items-center gap-2">
            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                title="Open job posting"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <Link
              to={`/applications/${application._id}`}
              className="flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Details
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
