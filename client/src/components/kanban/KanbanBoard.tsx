import React from 'react';
import { JobApplication, ApplicationStatus } from '../../types/application';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  applications: JobApplication[];
  onStatusChange: (appId: string, newStatus: ApplicationStatus) => Promise<void>;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onStatusChange,
}) => {
  const columns: { status: ApplicationStatus; title: string; color: string }[] = [
    { status: 'Wishlist', title: 'Wishlist', color: 'bg-purple-500' },
    { status: 'Applied', title: 'Applied', color: 'bg-sky-500' },
    { status: 'Screening', title: 'Screening', color: 'bg-amber-500' },
    { status: 'Interview', title: 'Interview', color: 'bg-indigo-500' },
    { status: 'Technical Round', title: 'Technical Round', color: 'bg-violet-600' },
    { status: 'Offer', title: 'Offer', color: 'bg-emerald-500' },
    { status: 'Rejected', title: 'Rejected', color: 'bg-rose-500' },
    { status: 'Withdrawn', title: 'Withdrawn', color: 'bg-gray-400' },
  ];

  const handleDrop = async (appId: string, newStatus: ApplicationStatus) => {
    const app = applications.find((a) => a._id === appId);
    if (!app || app.status === newStatus) return;
    await onStatusChange(appId, newStatus);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none scrollbar-thin">
      {columns.map((col) => {
        const columnApps = applications.filter((app) => app.status === col.status);
        return (
          <KanbanColumn
            key={col.status}
            status={col.status}
            title={col.title}
            colorClass={col.color}
            applications={columnApps}
            onDropApp={handleDrop}
          />
        );
      })}
    </div>
  );
};
