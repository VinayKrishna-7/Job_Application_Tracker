import React from 'react';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { ApplicationFilterParams } from '../../types/application';
import { RotateCcw } from 'lucide-react';

interface ApplicationFiltersProps {
  filters: ApplicationFilterParams;
  onChange: (newFilters: Partial<ApplicationFilterParams>) => void;
  onReset: () => void;
}

export const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  filters,
  onChange,
  onReset,
}) => {
  const hasActiveFilters = Boolean(
    filters.status ||
    filters.priority ||
    filters.workMode ||
    filters.employmentType ||
    filters.source ||
    filters.tag ||
    (filters.sortBy && filters.sortBy !== 'dateApplied') ||
    (filters.sortOrder && filters.sortOrder !== 'desc')
  );

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 transition-colors">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Status */}
        <Select
          label="Status"
          value={filters.status || 'All'}
          onChange={(e) => onChange({ status: e.target.value === 'All' ? undefined : e.target.value, page: 1 })}
          options={[
            { value: 'All', label: 'All Statuses' },
            { value: 'Wishlist', label: 'Wishlist' },
            { value: 'Applied', label: 'Applied' },
            { value: 'Screening', label: 'Screening' },
            { value: 'Interview', label: 'Interview' },
            { value: 'Technical Round', label: 'Technical Round' },
            { value: 'Offer', label: 'Offer' },
            { value: 'Rejected', label: 'Rejected' },
            { value: 'Withdrawn', label: 'Withdrawn' },
          ]}
        />

        {/* Priority */}
        <Select
          label="Priority"
          value={filters.priority || 'All'}
          onChange={(e) => onChange({ priority: e.target.value === 'All' ? undefined : e.target.value, page: 1 })}
          options={[
            { value: 'All', label: 'All Priorities' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
          ]}
        />

        {/* Work Mode */}
        <Select
          label="Work Mode"
          value={filters.workMode || 'All'}
          onChange={(e) => onChange({ workMode: e.target.value === 'All' ? undefined : e.target.value, page: 1 })}
          options={[
            { value: 'All', label: 'All Modes' },
            { value: 'Remote', label: 'Remote' },
            { value: 'Hybrid', label: 'Hybrid' },
            { value: 'On-site', label: 'On-site' },
          ]}
        />

        {/* Employment Type */}
        <Select
          label="Job Type"
          value={filters.employmentType || 'All'}
          onChange={(e) => onChange({ employmentType: e.target.value === 'All' ? undefined : e.target.value, page: 1 })}
          options={[
            { value: 'All', label: 'All Types' },
            { value: 'Full-time', label: 'Full-time' },
            { value: 'Part-time', label: 'Part-time' },
            { value: 'Contract', label: 'Contract' },
            { value: 'Internship', label: 'Internship' },
            { value: 'Freelance', label: 'Freelance' },
          ]}
        />

        {/* Source */}
        <Select
          label="Source"
          value={filters.source || 'All'}
          onChange={(e) => onChange({ source: e.target.value === 'All' ? undefined : e.target.value, page: 1 })}
          options={[
            { value: 'All', label: 'All Sources' },
            { value: 'LinkedIn', label: 'LinkedIn' },
            { value: 'Indeed', label: 'Indeed' },
            { value: 'Glassdoor', label: 'Glassdoor' },
            { value: 'Company Website', label: 'Company Website' },
            { value: 'Referral', label: 'Referral' },
            { value: 'Wellfound', label: 'Wellfound' },
            { value: 'Other', label: 'Other' },
          ]}
        />

        {/* Sort By */}
        <Select
          label="Sort By"
          value={`${filters.sortBy || 'dateApplied'}-${filters.sortOrder || 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            onChange({ sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 });
          }}
          options={[
            { value: 'dateApplied-desc', label: 'Newest First' },
            { value: 'dateApplied-asc', label: 'Oldest First' },
            { value: 'company-asc', label: 'Company A-Z' },
            { value: 'company-desc', label: 'Company Z-A' },
            { value: 'priority-asc', label: 'Priority' },
            { value: 'updatedAt-desc', label: 'Recently Updated' },
            { value: 'followUpDate-asc', label: 'Follow-up Date' },
          ]}
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <RotateCcw className="w-3 h-3 mr-1.5" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};
