import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '../services/applicationApi';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { ApplicationStatus, JobApplication } from '../types/application';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const KanbanPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: applications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['applications', 'kanban'],
    queryFn: applicationApi.getKanban,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ appId, newStatus }: { appId: string; newStatus: ApplicationStatus }) =>
      applicationApi.update(appId, { status: newStatus }),
    // Optimistic Update
    onMutate: async ({ appId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['applications', 'kanban'] });
      const previousApps = queryClient.getQueryData<JobApplication[]>(['applications', 'kanban']);

      if (previousApps) {
        queryClient.setQueryData<JobApplication[]>(
          ['applications', 'kanban'],
          previousApps.map((app) =>
            app._id === appId ? { ...app, status: newStatus } : app
          )
        );
      }

      return { previousApps };
    },
    onError: (err: any, _, context) => {
      if (context?.previousApps) {
        queryClient.setQueryData(['applications', 'kanban'], context.previousApps);
      }
      toast.error(err.message || 'Failed to update application stage.');
    },
    onSuccess: (updatedApp) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Moved to ${updatedApp.status}`);
    },
  });

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    await updateStatusMutation.mutateAsync({ appId, newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Kanban Pipeline Board
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Drag cards across columns to advance your application recruitment stages.
          </p>
        </div>

        <Button onClick={() => navigate('/applications/new')} size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Application
        </Button>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[280px]">
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <KanbanBoard
          applications={applications}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};
