import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from '../services/applicationApi';
import { interviewApi } from '../services/interviewApi';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { InterviewTimeline } from '../components/interviews/InterviewTimeline';
import { InterviewModal } from '../components/interviews/InterviewModal';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkeletonCard } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import {
  formatDate,
  formatSalaryRange,
  getDaysRemaining,
} from '../utils/formatters';
import { ApplicationStatus } from '../types/application';
import { Interview, CreateInterviewInput } from '../types/interview';
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  DollarSign,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  Download,
  Edit2,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewToEdit, setInterviewToEdit] = useState<Interview | null>(null);

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

  const deleteAppMutation = useMutation({
    mutationFn: () => applicationApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Application deleted successfully.');
      navigate('/applications');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete application.');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: ApplicationStatus) =>
      applicationApi.update(id!, { status: newStatus }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['application', id], (prev: any) => ({
        ...prev,
        status: updated.status,
      }));
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Status updated to ${updated.status}.`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update status.');
    },
  });

  const createOrUpdateInterviewMutation = useMutation({
    mutationFn: async (data: CreateInterviewInput) => {
      if (interviewToEdit) {
        return interviewApi.update(interviewToEdit._id, data);
      }
      return interviewApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      setIsInterviewModalOpen(false);
      setInterviewToEdit(null);
      toast.success(
        interviewToEdit ? 'Interview updated successfully.' : 'Interview scheduled successfully!'
      );
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to process interview.');
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <ErrorState
        title="Application not found"
        message="This application could not be loaded. It might have been deleted."
        onRetry={() => refetch()}
      />
    );
  }

  const followUp = application.followUpDate ? getDaysRemaining(application.followUpDate) : null;
  const statuses: ApplicationStatus[] = [
    'Wishlist',
    'Applied',
    'Screening',
    'Interview',
    'Technical Round',
    'Offer',
    'Rejected',
    'Withdrawn',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/applications"
            className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
              {application.company}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {application.position}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Quick status selector */}
          <div className="relative inline-block">
            <select
              value={application.status}
              onChange={(e) => updateStatusMutation.mutate(e.target.value as ApplicationStatus)}
              className="appearance-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 pr-8 text-xs font-semibold text-gray-800 dark:text-gray-200 cursor-pointer shadow-xs focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
            >
              {statuses.map((s) => (
                <option
                  key={s}
                  value={s}
                  className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
                >
                  Status: {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          </div>

          <Link to={`/applications/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          </Link>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job & Recruiter Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <Card className="p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <StatusBadge status={application.status} size="md" />
                <PriorityBadge priority={application.priority} />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Applied on {formatDate(application.dateApplied)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-gray-400 uppercase font-semibold text-[10px]">
                  Location & Work Mode
                </span>
                <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200 font-medium">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>
                    {application.location || 'Remote'} ({application.workMode})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 uppercase font-semibold text-[10px]">
                  Employment Type
                </span>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {application.employmentType}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 uppercase font-semibold text-[10px]">
                  Target Compensation
                </span>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {formatSalaryRange(
                      application.salaryMin,
                      application.salaryMax,
                      application.currency
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 uppercase font-semibold text-[10px]">
                  Application Source
                </span>
                <p className="text-gray-800 dark:text-gray-200 font-medium">
                  {application.source || 'Direct Website'}
                </p>
              </div>

              {application.jobUrl && (
                <div className="sm:col-span-2 pt-1">
                  <span className="text-gray-400 uppercase font-semibold text-[10px] block mb-1">
                    Job Posting
                  </span>
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-xs break-all"
                  >
                    {application.jobUrl}
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            {application.tags && application.tags.length > 0 && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-400 uppercase font-semibold text-[10px] block mb-2">
                  Tags & Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {application.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Notes Card */}
          <Card className="p-5 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Notes & Company Research
            </h4>
            {application.notes ? (
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-50/70 dark:bg-gray-800/40 p-3.5 rounded-xl border border-gray-100 dark:border-gray-800">
                {application.notes}
              </p>
            ) : (
              <p className="text-xs text-gray-400 italic">
                No preparation notes logged yet. Click Edit to add notes.
              </p>
            )}
          </Card>

          {/* Interview Timeline */}
          <InterviewTimeline
            interviews={application.interviews || []}
            onAddInterview={() => {
              setInterviewToEdit(null);
              setIsInterviewModalOpen(true);
            }}
            onEditInterview={(interview) => {
              setInterviewToEdit(interview);
              setIsInterviewModalOpen(true);
            }}
          />
        </div>

        {/* Right Column: Follow-up, Recruiter, Attached Documents */}
        <div className="space-y-6">
          {/* Follow-up Reminder Box */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Follow-Up Reminder
              </h4>
            </div>

            {application.followUpDate ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Scheduled Date:</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                    {formatDate(application.followUpDate)}
                  </span>
                </div>
                {followUp && (
                  <div
                    className={`rounded-lg p-2.5 text-center text-xs font-bold ${
                      followUp.isOverdue
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : followUp.isToday
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    }`}
                  >
                    {followUp.label}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No follow-up scheduled.</p>
            )}
          </Card>

          {/* Contact Person Box */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <User className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Contact Person
              </h4>
            </div>

            {application.contactName || application.contactEmail || application.contactPhone ? (
              <div className="space-y-2 text-xs">
                {application.contactName && (
                  <div className="font-bold text-gray-900 dark:text-gray-100">
                    {application.contactName}
                  </div>
                )}
                {application.contactEmail && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <a
                      href={`mailto:${application.contactEmail}`}
                      className="hover:underline text-indigo-600 dark:text-indigo-400 truncate"
                    >
                      {application.contactEmail}
                    </a>
                  </div>
                )}
                {application.contactPhone && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{application.contactPhone}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No contact person entered.</p>
            )}
          </Card>

          {/* Resume / Documents */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Attached Documents
              </h4>
            </div>

            {application.resumeUrl ? (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/30 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                    Attached Resume
                  </span>
                </div>
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-1.5 rounded-lg text-indigo-600 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  title="Download / View Resume"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No resume attached.</p>
            )}
          </Card>
        </div>
      </div>

      {/* Delete Application Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          await deleteAppMutation.mutateAsync();
        }}
        title="Delete Application"
        message={`Are you sure you want to permanently delete your application for ${application.company}? This cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={deleteAppMutation.isPending}
      />

      {/* Schedule / Edit Interview Modal */}
      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => {
          setIsInterviewModalOpen(false);
          setInterviewToEdit(null);
        }}
        onSubmit={async (data) => {
          await createOrUpdateInterviewMutation.mutateAsync({
            ...data,
            applicationId: id!,
          });
        }}
        defaultApplicationId={id}
        interviewToEdit={interviewToEdit}
        isLoading={createOrUpdateInterviewMutation.isPending}
      />
    </div>
  );
};
