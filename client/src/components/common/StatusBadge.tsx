import React from 'react';
import { ApplicationStatus } from '../../types/application';
import { Badge } from '../ui/Badge';
import {
  Sparkles,
  Send,
  Eye,
  Calendar,
  Code2,
  Trophy,
  XCircle,
  Archive,
} from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  switch (status) {
    case 'Wishlist':
      return (
        <Badge variant="purple" size={size}>
          {showIcon && <Sparkles className="w-3 h-3" />}
          Wishlist
        </Badge>
      );
    case 'Applied':
      return (
        <Badge variant="info" size={size}>
          {showIcon && <Send className="w-3 h-3" />}
          Applied
        </Badge>
      );
    case 'Screening':
      return (
        <Badge variant="warning" size={size}>
          {showIcon && <Eye className="w-3 h-3" />}
          Screening
        </Badge>
      );
    case 'Interview':
      return (
        <Badge variant="primary" size={size}>
          {showIcon && <Calendar className="w-3 h-3" />}
          Interview
        </Badge>
      );
    case 'Technical Round':
      return (
        <Badge variant="primary" size={size}>
          {showIcon && <Code2 className="w-3 h-3" />}
          Technical
        </Badge>
      );
    case 'Offer':
      return (
        <Badge variant="success" size={size}>
          {showIcon && <Trophy className="w-3 h-3" />}
          Offer
        </Badge>
      );
    case 'Rejected':
      return (
        <Badge variant="danger" size={size}>
          {showIcon && <XCircle className="w-3 h-3" />}
          Rejected
        </Badge>
      );
    case 'Withdrawn':
      return (
        <Badge variant="default" size={size}>
          {showIcon && <Archive className="w-3 h-3" />}
          Withdrawn
        </Badge>
      );
    default:
      return <Badge size={size}>{status}</Badge>;
  }
};
