import React, { ReactNode } from 'react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800/80 bg-white/50 dark:bg-gray-900/50">
      {icon && (
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
