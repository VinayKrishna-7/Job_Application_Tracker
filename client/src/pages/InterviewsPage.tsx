import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewApi } from '../services/interviewApi';
import { applicationApi } from '../services/applicationApi';
import { InterviewCard } from '../components/interviews/InterviewCard';
import { InterviewModal } from '../components/interviews/InterviewModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Interview, InterviewResult, CreateInterviewInput } from '../types/interview';
import { Plus, CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';

export const InterviewsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [interviewToEdit, setInterviewToEdit] = useState<Interview | null>(null);
  const [interviewToDelete, setInterviewToDelete] = useState<string | null>(null);

  const {
    data: interviews = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['interviews', statusFilter],
    queryFn: () => interviewApi.list({ status: statusFilter === 'All' ? undefined : statusFilter }),
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['applications', 'selectList'],
    queryFn: async () => {
      const res = await applicationApi.list({ limit: 100 });
      return res.data;
    },
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: (data: CreateInterviewInput) => {
      if (interviewToEdit) {
        return interviewApi.update(interviewToEdit._id, data);
      }
      return interviewApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsModalOpen(false);
      setInterviewToEdit(null);
      toast.success(
        interviewToEdit ? 'Interview updated successfully.' : 'Interview scheduled successfully!'
      );
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to save interview.');
    },
  });

  const markResultMutation = useMutation({
    mutationFn: ({ id, result }: { id: string; result: InterviewResult }) =>
      interviewApi.update(id, { result }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Interview status updated.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update result.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => interviewApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setInterviewToDelete(null);
      toast.success('Interview deleted successfully.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete interview.');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Interviews & Meeting Schedule
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Log interview dates, preparation pointers, and call credentials.
          </p>
        </div>

        <Button
          onClick={() => {
            setInterviewToEdit(null);
            setIsModalOpen(true);
          }}
          size="md"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Schedule Interview
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-48">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'All', label: 'All Results' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Passed', label: 'Passed' },
              { value: 'Failed', label: 'Failed' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
          />
        </div>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : interviews.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck className="w-6 h-6" />}
          title="No interviews found"
          description={
            statusFilter !== 'All'
              ? 'No interviews match your selected result filter.'
              : 'Keep yourself prepared by recording upcoming technical screens and interview rounds.'
          }
          actionText={statusFilter !== 'All' ? 'View All Interviews' : 'Schedule First Interview'}
          onAction={
            statusFilter !== 'All'
              ? () => setStatusFilter('All')
              : () => {
                  setInterviewToEdit(null);
                  setIsModalOpen(true);
                }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {interviews.map((int) => (
            <InterviewCard
              key={int._id}
              interview={int}
              onEdit={(interview) => {
                setInterviewToEdit(interview);
                setIsModalOpen(true);
              }}
              onDelete={(id) => setInterviewToDelete(id)}
              onMarkResult={(id, result) => markResultMutation.mutate({ id, result })}
            />
          ))}
        </div>
      )}

      {/* Modal for adding/editing interview */}
      <InterviewModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setInterviewToEdit(null);
        }}
        onSubmit={async (data) => {
          await createOrUpdateMutation.mutateAsync(data);
        }}
        applications={applications}
        interviewToEdit={interviewToEdit}
        isLoading={createOrUpdateMutation.isPending}
      />

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={!!interviewToDelete}
        onClose={() => setInterviewToDelete(null)}
        onConfirm={async () => {
          if (interviewToDelete) {
            await deleteMutation.mutateAsync(interviewToDelete);
          }
        }}
        title="Delete Interview"
        message="Are you sure you want to remove this interview record? This action cannot be reversed."
        confirmText="Delete"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
