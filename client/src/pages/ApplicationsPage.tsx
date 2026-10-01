import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '../services/applicationApi';
import { ApplicationCard } from '../components/applications/ApplicationCard';
import { ApplicationTable } from '../components/applications/ApplicationTable';
import { ApplicationFilters } from '../components/applications/ApplicationFilters';
import { SearchInput } from '../components/ui/SearchInput';
import { Pagination } from '../components/ui/Pagination';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonCard, SkeletonTable } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { ApplicationFilterParams, ApplicationStatus } from '../types/application';
import {
  Plus,
  LayoutGrid,
  List,
  Filter,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [filterParams, setFilterParams] = useState<ApplicationFilterParams>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'dateApplied',
    sortOrder: 'desc',
  });

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['applications', filterParams],
    queryFn: () => applicationApi.list(filterParams),
  });

  // Mutation for quick status change
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Application status updated.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update status.');
    },
  });

  // Mutation for deleting an application
  const deleteMutation = useMutation({
    mutationFn: (id: string) => applicationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Application deleted successfully.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete application.');
    },
  });

  const handleSearchChange = (search: string) => {
    setFilterParams((prev: ApplicationFilterParams) => ({ ...prev, search, page: 1 }));
  };

  const handleFilterChange = (newFilters: Partial<ApplicationFilterParams>) => {
    setFilterParams((prev: ApplicationFilterParams) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilterParams({
      page: 1,
      limit: 10,
      search: '',
      sortBy: 'dateApplied',
      sortOrder: 'desc',
    });
  };

  const applications = data?.data || [];
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Job Applications
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage, filter, and track all submitted job opportunities.
          </p>
        </div>

        <Button onClick={() => navigate('/applications/new')} size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Application
        </Button>
      </div>

      {/* Control Bar: Search, Filters toggle, View switcher */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:max-w-md">
          <SearchInput
            value={filterParams.search}
            onChange={handleSearchChange}
            placeholder="Search company, position, tags, notes..."
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs"
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            Filters
          </Button>

          {/* View switcher */}
          <div className="flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-0.5 shadow-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`rounded p-1.5 transition-colors ${
                viewMode === 'table'
                  ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter drawer / collapsible area */}
      {showFilters && (
        <ApplicationFilters
          filters={filterParams}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
      )}

      {/* Main Content Area */}
      {isLoading ? (
        viewMode === 'table' ? (
          <SkeletonTable rows={8} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6" />}
          title="No applications found"
          description={
            filterParams.search || filterParams.status
              ? 'Try modifying your search keywords or resetting your active filters.'
              : 'You have not added any job applications yet. Begin your tracking journey today.'
          }
          actionText={
            filterParams.search || filterParams.status
              ? 'Clear All Filters'
              : 'Add First Application'
          }
          onAction={
            filterParams.search || filterParams.status
              ? handleResetFilters
              : () => navigate('/applications/new')
          }
        />
      ) : (
        <div className="space-y-4">
          {viewMode === 'table' ? (
            <ApplicationTable
              applications={applications}
              onDelete={async (id) => {
                await deleteMutation.mutateAsync(id);
              }}
              onStatusChange={async (id, status) => {
                await statusMutation.mutateAsync({ id, status });
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app) => (
                <ApplicationCard
                  key={app._id}
                  application={app}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            meta={pagination}
            onPageChange={(page) => setFilterParams((prev: ApplicationFilterParams) => ({ ...prev, page }))}
          />
        </div>
      )}
    </div>
  );
};
