import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { JobApplication, ApplicationStatus } from '../../types/application';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDate, getDaysRemaining } from '../../utils/formatters';
import {
  Eye,
  Edit2,
  Trash2,
  ChevronDown,
  Check,
} from 'lucide-react';

interface ApplicationTableProps {
  applications: JobApplication[];
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => Promise<void>;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onDelete,
  onStatusChange,
}) => {
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-status-dropdown]')) {
        setOpenStatusMenuId(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await onDelete(deleteTarget._id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const statuses: ApplicationStatus[] = [
    'Wishlist',
    'Applied',
    'Screening',
    'Interview',
    'Technical Round',
    'Offer',
    'Rejected',
    'Withdrawn',
  ];

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left text-xs text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-[11px] uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200/80 dark:border-gray-800">
            <tr>
              <th scope="col" className="px-4 py-3.5">Company & Role</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5">Priority</th>
              <th scope="col" className="px-4 py-3.5">Location</th>
              <th scope="col" className="px-4 py-3.5">Date Applied</th>
              <th scope="col" className="px-4 py-3.5">Next Follow-up</th>
              <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {applications.map((app) => {
              const followUp = app.followUpDate ? getDaysRemaining(app.followUpDate) : null;

              return (
                <tr
                  key={app._id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-4 py-3.5 font-medium">
                    <Link
                      to={`/applications/${app._id}`}
                      className="font-bold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 block text-sm"
                    >
                      {app.company}
                    </Link>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {app.position}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="relative inline-block" data-status-dropdown>
                      <button
                        type="button"
                        onClick={() => setOpenStatusMenuId(openStatusMenuId === app._id ? null : app._id)}
                        className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-all hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        title="Click to change status"
                      >
                        <StatusBadge status={app.status} size="sm" />
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                      </button>

                      {openStatusMenuId === app._id && (
                        <div className="absolute left-0 mt-1.5 w-48 rounded-xl border border-gray-200/90 bg-white py-1.5 shadow-2xl dark:border-gray-700 dark:bg-gray-900 z-50 animate-in fade-in zoom-in-95 duration-100">
                          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800 mb-1">
                            Update Status
                          </div>
                          {statuses.map((s) => {
                            const isSelected = app.status === s;
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  onStatusChange(app._id, s);
                                  setOpenStatusMenuId(null);
                                }}
                                className={`flex w-full items-center justify-between px-3 py-1.5 text-xs transition-colors ${
                                  isSelected
                                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                                }`}
                              >
                                <StatusBadge status={s} size="sm" />
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ml-2 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <PriorityBadge priority={app.priority} />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div>{app.location || 'Remote'}</div>
                    <div className="text-[10px] text-gray-400">{app.workMode}</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {formatDate(app.dateApplied)}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {followUp ? (
                      <span
                        className={`font-semibold ${
                          followUp.isOverdue
                            ? 'text-rose-600 dark:text-rose-400'
                            : followUp.isToday
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {followUp.label}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/applications/${app._id}`}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/applications/${app._id}/edit`}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                        title="Edit application"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(app)}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-rose-50 hover:text-rose-600 dark:text-gray-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Application"
        message={`Are you sure you want to delete your application for ${deleteTarget?.company}? This will also delete any scheduled interviews for this position.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
};
