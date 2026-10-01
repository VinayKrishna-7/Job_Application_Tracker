import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  JobApplication,
  ApplicationStatus,
  ApplicationPriority,
  EmploymentType,
  WorkMode,
} from '../../types/application';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { applicationApi } from '../../services/applicationApi';
import { toast } from 'sonner';
import {
  UploadCloud,
  FileText,
  X,
  Plus,
} from 'lucide-react';

const applicationSchema = z.object({
  company: z.string().trim().min(1, 'Company name is required').max(120),
  position: z.string().trim().min(1, 'Job title is required').max(120),
  location: z.string().trim().max(120).optional(),
  jobUrl: z.string().trim().optional(),
  status: z.enum([
    'Wishlist',
    'Applied',
    'Screening',
    'Interview',
    'Technical Round',
    'Offer',
    'Rejected',
    'Withdrawn',
  ] as const),
  priority: z.enum(['Low', 'Medium', 'High'] as const),
  employmentType: z.enum([
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance',
    'Temporary',
  ] as const),
  workMode: z.enum(['Remote', 'Hybrid', 'On-site'] as const),
  salaryMin: z.union([z.number().positive(), z.nan(), z.literal('')]).optional().nullable(),
  salaryMax: z.union([z.number().positive(), z.nan(), z.literal('')]).optional().nullable(),
  currency: z.string().default('USD'),
  dateApplied: z.string(),
  source: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  contactEmail: z.string().trim().optional(),
  contactPhone: z.string().trim().optional(),
  notes: z.string().optional(),
  resumeUrl: z.string().optional(),
  coverLetterUrl: z.string().optional(),
  followUpDate: z.string().optional().nullable(),
});

type FormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  initialData?: Partial<JobApplication>;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save Application',
}) => {
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadedResumeName, setUploadedResumeName] = useState<string | null>(
    initialData?.resumeUrl ? 'Attached Resume' : null
  );

  const defaultDateApplied = initialData?.dateApplied
    ? new Date(initialData.dateApplied).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];

  const defaultFollowUpDate = initialData?.followUpDate
    ? new Date(initialData.followUpDate).toISOString().split('T')[0]
    : '';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      company: initialData?.company || '',
      position: initialData?.position || '',
      location: initialData?.location || '',
      jobUrl: initialData?.jobUrl || '',
      status: (initialData?.status as ApplicationStatus) || 'Applied',
      priority: (initialData?.priority as ApplicationPriority) || 'Medium',
      employmentType: (initialData?.employmentType as EmploymentType) || 'Full-time',
      workMode: (initialData?.workMode as WorkMode) || 'Remote',
      salaryMin: initialData?.salaryMin ?? undefined,
      salaryMax: initialData?.salaryMax ?? undefined,
      currency: initialData?.currency || 'USD',
      dateApplied: defaultDateApplied,
      source: initialData?.source || 'LinkedIn',
      contactName: initialData?.contactName || '',
      contactEmail: initialData?.contactEmail || '',
      contactPhone: initialData?.contactPhone || '',
      notes: initialData?.notes || '',
      resumeUrl: initialData?.resumeUrl || '',
      coverLetterUrl: initialData?.coverLetterUrl || '',
      followUpDate: defaultFollowUpDate || undefined,
    },
  });

  const resumeUrl = watch('resumeUrl');

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit.');
      return;
    }

    try {
      setIsUploadingResume(true);
      const res = await applicationApi.uploadResume(file);
      setValue('resumeUrl', res.url);
      setUploadedResumeName(res.filename || file.name);
      toast.success('Resume uploaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload resume');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    const cleanedData = {
      ...formData,
      salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      followUpDate: formData.followUpDate ? new Date(formData.followUpDate).toISOString() : null,
      dateApplied: formData.dateApplied ? new Date(formData.dateApplied).toISOString() : new Date().toISOString(),
      tags,
    };

    await onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Section 1: Basic Job Info */}
      <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
        <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Job Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company"
            placeholder="e.g. Stripe, Linear, Google"
            required
            error={errors.company?.message}
            {...register('company')}
          />

          <Input
            label="Job Title / Position"
            placeholder="e.g. Senior Frontend Engineer"
            required
            error={errors.position?.message}
            {...register('position')}
          />

          <Input
            label="Location"
            placeholder="e.g. San Francisco, CA or Remote"
            error={errors.location?.message}
            {...register('location')}
          />

          <Input
            label="Job Posting URL"
            type="url"
            placeholder="https://company.com/careers/job"
            error={errors.jobUrl?.message}
            {...register('jobUrl')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Employment Type"
            error={errors.employmentType?.message}
            {...register('employmentType')}
            options={[
              { value: 'Full-time', label: 'Full-time' },
              { value: 'Part-time', label: 'Part-time' },
              { value: 'Contract', label: 'Contract' },
              { value: 'Internship', label: 'Internship' },
              { value: 'Freelance', label: 'Freelance' },
              { value: 'Temporary', label: 'Temporary' },
            ]}
          />

          <Select
            label="Work Mode"
            error={errors.workMode?.message}
            {...register('workMode')}
            options={[
              { value: 'Remote', label: 'Remote' },
              { value: 'Hybrid', label: 'Hybrid' },
              { value: 'On-site', label: 'On-site' },
            ]}
          />

          <Select
            label="Source"
            error={errors.source?.message}
            {...register('source')}
            options={[
              { value: 'LinkedIn', label: 'LinkedIn' },
              { value: 'Indeed', label: 'Indeed' },
              { value: 'Glassdoor', label: 'Glassdoor' },
              { value: 'Company Website', label: 'Company Website' },
              { value: 'Referral', label: 'Referral' },
              { value: 'Wellfound', label: 'Wellfound' },
              { value: 'AngelList', label: 'AngelList' },
              { value: 'Recruiter', label: 'Recruiter' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>
      </div>

      {/* Section 2: Application Status & Tracking */}
      <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Status & Priority
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Select
            label="Current Status"
            error={errors.status?.message}
            {...register('status')}
            options={[
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

          <Select
            label="Priority Level"
            error={errors.priority?.message}
            {...register('priority')}
            options={[
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' },
            ]}
          />

          <Input
            label="Date Applied"
            type="date"
            error={errors.dateApplied?.message}
            {...register('dateApplied')}
          />

          <Input
            label="Next Follow-up Date"
            type="date"
            error={errors.followUpDate?.message}
            {...register('followUpDate')}
          />
        </div>
      </div>

      {/* Section 3: Compensation */}
      <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Compensation
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Minimum Salary"
            type="number"
            placeholder="e.g. 130000"
            error={errors.salaryMin?.message}
            {...register('salaryMin', { valueAsNumber: true })}
          />

          <Input
            label="Maximum Salary"
            type="number"
            placeholder="e.g. 170000"
            error={errors.salaryMax?.message}
            {...register('salaryMax', { valueAsNumber: true })}
          />

          <Select
            label="Currency"
            {...register('currency')}
            options={[
              { value: 'USD', label: 'USD ($)' },
              { value: 'EUR', label: 'EUR (€)' },
              { value: 'GBP', label: 'GBP (£)' },
              { value: 'CAD', label: 'CAD ($)' },
              { value: 'AUD', label: 'AUD ($)' },
              { value: 'INR', label: 'INR (₹)' },
            ]}
          />
        </div>
      </div>

      {/* Section 4: Contact & Documents */}
      <div className="rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Contact & Documents
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Contact Person"
            placeholder="Recruiter or Hiring Manager"
            error={errors.contactName?.message}
            {...register('contactName')}
          />

          <Input
            label="Contact Email"
            type="email"
            placeholder="recruiter@company.com"
            error={errors.contactEmail?.message}
            {...register('contactEmail')}
          />

          <Input
            label="Contact Phone"
            placeholder="+1 (555) 000-0000"
            error={errors.contactPhone?.message}
            {...register('contactPhone')}
          />
        </div>

        {/* Resume File Upload */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Attach Resume (PDF, DOC, DOCX - Max 5MB)
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60 cursor-pointer shadow-sm transition-colors">
              <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{isUploadingResume ? 'Uploading...' : 'Choose File'}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileUpload}
                disabled={isUploadingResume}
                className="hidden"
              />
            </label>

            {resumeUrl && (
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 px-3 py-1.5 rounded-lg text-xs text-indigo-800 dark:text-indigo-300">
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate max-w-xs">{uploadedResumeName || 'Resume Attached'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setValue('resumeUrl', '');
                    setUploadedResumeName(null);
                  }}
                  className="text-gray-400 hover:text-rose-500 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            Tags (Skills, Tech Stack, Industry)
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="e.g. React, TypeScript, FinTech"
              className="max-w-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200/60 dark:border-indigo-800/40"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-rose-600 dark:hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <Textarea
          label="Application Notes & Preparation"
          rows={4}
          placeholder="Add recruiter feedback, interview preparation pointers, referral notes, or company research..."
          error={errors.notes?.message}
          {...register('notes')}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="submit" isLoading={isLoading} size="lg">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
