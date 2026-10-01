import React, { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  iconBgColor?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  iconBgColor = 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  className,
}) => {
  return (
    <Card
      className={cn(
        'p-5 border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900 rounded-xl shadow-2xs transition-shadow hover:shadow-xs',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            iconBgColor
          )}
        >
          {icon}
        </div>
      </div>

      <div className="mt-2">
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {value}
        </div>

        {description && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};


