export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (dateString?: string | null): string => {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return 'Invalid date';
  }
};

export const formatSalaryRange = (
  min?: number | null,
  max?: number | null,
  currency: string = 'USD'
): string => {
  if (!min && !max) return 'Not specified';

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max) {
    if (min === max) return formatter.format(min);
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) return `From ${formatter.format(min)}`;
  if (max) return `Up to ${formatter.format(max)}`;

  return 'Not specified';
};

export const getDaysRemaining = (targetDateStr: string | null | undefined): { label: string; isOverdue: boolean; isToday: boolean } => {
  if (!targetDateStr) return { label: 'No date', isOverdue: false, isToday: false };

  const target = new Date(targetDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffTime = targetDay.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { label: 'Due today', isOverdue: false, isToday: true };
  } else if (diffDays < 0) {
    return { label: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isToday: false };
  } else if (diffDays === 1) {
    return { label: 'Tomorrow', isOverdue: false, isToday: false };
  } else {
    return { label: `In ${diffDays} days`, isOverdue: false, isToday: false };
  }
};
