import React from 'react';
import { Interview, InterviewResult } from '../../types/interview';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDateTime } from '../../utils/formatters';
import {
  Calendar,
  Video,
  User,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Trash2,
  Edit2,
} from 'lucide-react';

interface InterviewCardProps {
  interview: Interview;
  onEdit?: (interview: Interview) => void;
  onDelete?: (id: string) => void;
  onMarkResult?: (id: string, result: InterviewResult) => void;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onEdit,
  onDelete,
  onMarkResult,
}) => {
  const app = typeof interview.applicationId === 'object' ? interview.applicationId : null;

  const getResultBadge = (result: InterviewResult) => {
    switch (result) {
      case 'Passed':
        return <Badge variant="success">Passed</Badge>;
      case 'Failed':
        return <Badge variant="danger">Failed</Badge>;
      case 'Completed':
        return <Badge variant="info">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="default">Cancelled</Badge>;
      case 'Scheduled':
      default:
        return <Badge variant="primary">Scheduled</Badge>;
    }
  };

  return (
    <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-sm">
      <div className="p-5 flex flex-col justify-between h-full space-y-4">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              {app && (
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {app.company}
                </p>
              )}
              <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Round {interview.round}: {interview.type}
              </h4>
            </div>
            {getResultBadge(interview.result)}
          </div>

          {/* Details */}
          <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {formatDateTime(interview.date)}
              </span>
            </div>

            {interview.interviewer && (
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>With {interview.interviewer}</span>
              </div>
            )}

            {interview.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{interview.location}</span>
              </div>
            )}

            {interview.meetingUrl && (
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={interview.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Video className="w-3.5 h-3.5" />
                  Join Meeting Call
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {interview.notes && (
              <div className="mt-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/60 p-2.5 text-xs text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-[11px] text-gray-500 uppercase mb-0.5">Notes</p>
                <p className="whitespace-pre-wrap">{interview.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5">
            {interview.result === 'Scheduled' && onMarkResult && (
              <button
                onClick={() => onMarkResult(interview._id, 'Passed')}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                title="Mark as Passed"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Passed
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(interview)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                title="Edit interview"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(interview._id)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                title="Delete interview"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
