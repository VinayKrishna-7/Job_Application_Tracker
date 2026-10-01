import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types/application';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { page, totalPages, total, limit } = meta;

  if (totalPages <= 1) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-1 text-xs text-gray-500 dark:text-gray-400">
      <div>
        Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{startItem}</span> to{' '}
        <span className="font-semibold text-gray-800 dark:text-gray-200">{endItem}</span> of{' '}
        <span className="font-semibold text-gray-800 dark:text-gray-200">{total}</span> applications
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Previous
        </Button>
        <span className="px-3 py-1 font-medium text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};
