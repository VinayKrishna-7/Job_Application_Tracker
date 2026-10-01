import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse rounded bg-gray-200 dark:bg-gray-800', className)} />
);

export const SkeletonCard: React.FC = () => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-4 w-48" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
      <Skeleton className="h-5 w-40" />
    </div>
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStats: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    ))}
  </div>
);
