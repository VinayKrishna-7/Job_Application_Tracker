import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load data. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-4 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Retry
        </Button>
      )}
    </div>
  );
};
