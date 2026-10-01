import React from 'react';
import { ApplicationPriority } from '../../types/application';
import { Badge } from '../ui/Badge';

interface PriorityBadgeProps {
  priority: ApplicationPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  switch (priority) {
    case 'High':
      return (
        <Badge variant="danger" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          High
        </Badge>
      );
    case 'Medium':
      return (
        <Badge variant="warning" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Medium
        </Badge>
      );
    case 'Low':
      return (
        <Badge variant="default" size={size}>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          Low
        </Badge>
      );
    default:
      return <Badge size={size}>{priority}</Badge>;
  }
};
