import React from 'react';
import { Link } from 'react-router-dom';
import { JobApplication } from '../../types/application';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatDate } from '../../utils/formatters';
import { MapPin, Calendar, GripVertical } from 'lucide-react';

interface KanbanCardProps {
  application: JobApplication;
  onDragStart: (e: React.DragEvent, app: JobApplication) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  application,
  onDragStart,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, application)}
      className="group relative rounded-xl border border-gray-200/80 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md cursor-grab active:cursor-grabbing dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700 select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex-1 min-w-0">
          <Link
            to={`/applications/${application._id}`}
            className="font-bold text-xs text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block"
          >
            {application.company}
          </Link>
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
            {application.position}
          </p>
        </div>
        <GripVertical className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="space-y-1 text-[11px] text-gray-500 dark:text-gray-400 my-2.5">
        {application.location && (
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate">{application.location}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
          <span>{formatDate(application.dateApplied)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80">
        <PriorityBadge priority={application.priority} size="sm" />
        <span className="text-[10px] text-gray-400 font-medium">
          {application.workMode}
        </span>
      </div>
    </div>
  );
};
