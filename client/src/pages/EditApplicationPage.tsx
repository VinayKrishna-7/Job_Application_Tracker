import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '../services/applicationApi';
import { ApplicationForm } from '../components/applications/ApplicationForm';
import { SkeletonCard } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const EditApplicationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: application,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationApi.getById(id!),
    enabled: !!id,
  });

  const handleSubmit = async (data: any) => {
    if (!id) return;
    try {
      setIsSubmitting(true);
      await applicationApi.update(id, data);
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Application updated successfully!');
      navigate(`/applications/${id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <SkeletonCard />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <ErrorState
        title="Application not found"
        message="This application may have been removed or does not belong to your account."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link
          to={`/applications/${id}`}
          className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
            Edit Application: {application.company}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Modify position details, update notes, or reschedule follow-up dates.
          </p>
        </div>
      </div>

      <ApplicationForm
        initialData={application}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel="Update Application"
      />
    </div>
  );
};
