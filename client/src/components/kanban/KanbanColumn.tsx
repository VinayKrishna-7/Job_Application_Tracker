import React, { useState } from 'react';
import { JobApplication, ApplicationStatus } from '../../types/application';
import { KanbanCard } from './KanbanCard';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface KanbanColumnProps {
  status: ApplicationStatus;
  title: string;
  applications: JobApplication[];
  colorClass: string;
  onDropApp: (appId: string, newStatus: ApplicationStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  title,
  applications,
  colorClass,
  onDropApp,
}) => {
  const [isOver, setIsOver] = useState(false);
  const navigate = useNavigate();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const appId = e.dataTransfer.getData('text/plain');
    if (appId) {
      onDropApp(appId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, app: JobApplication) => {
    e.dataTransfer.setData('text/plain', app._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-[280px] max-w-[320px] rounded-2xl bg-gray-100/70 p-3 dark:bg-gray-900/40 border transition-all ${
        isOver
          ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-inner'
          : 'border-gray-200/70 dark:border-gray-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
          <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200 uppercase tracking-wider">
            {title}
          </h4>
          <span className="rounded-full bg-white dark:bg-gray-800 px-2 py-0.5 text-[11px] font-bold text-gray-600 dark:text-gray-400 shadow-xs border border-gray-200/50 dark:border-gray-700/50">
            {applications.length}
          </span>
        </div>
        <button
          onClick={() => navigate('/applications/new')}
          className="rounded p-1 text-gray-400 hover:bg-white hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
          title={`Add application to ${title}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
        {applications.map((app) => (
          <KanbanCard
            key={app._id}
            application={app}
            onDragStart={handleDragStart}
          />
        ))}

        {applications.length === 0 && (
          <div className="flex h-28 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300/80 dark:border-gray-800 text-center p-3 text-xs text-gray-400">
            <span>No applications in this stage</span>
          </div>
        )}
      </div>
    </div>
  );
};
