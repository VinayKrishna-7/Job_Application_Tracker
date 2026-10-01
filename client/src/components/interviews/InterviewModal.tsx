import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import {
  Interview,
  InterviewType,
  InterviewResult,
  CreateInterviewInput,
} from '../../types/interview';
import { JobApplication } from '../../types/application';

const interviewSchema = z.object({
  applicationId: z.string().min(1, 'Please select an application'),
  date: z.string().min(1, 'Interview date & time is required'),
  type: z.enum([
    'Phone Screen',
    'Video Call',
    'Technical',
    'Behavioral',
    'System Design',
    'HR',
    'On-site',
    'Other',
  ] as const),
  round: z.coerce.number().int().min(1, 'Round must be at least 1'),
  interviewer: z.string().trim().optional(),
  meetingUrl: z.string().trim().optional(),
  location: z.string().trim().optional(),
  notes: z.string().optional(),
  result: z.enum([
    'Scheduled',
    'Completed',
    'Passed',
    'Failed',
    'Cancelled',
  ] as const),
});

type FormData = z.infer<typeof interviewSchema>;

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInterviewInput) => Promise<void>;
  applications?: JobApplication[];
  defaultApplicationId?: string;
  interviewToEdit?: Interview | null;
  isLoading?: boolean;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  applications = [],
  defaultApplicationId,
  interviewToEdit,
  isLoading = false,
}) => {
  const getFormattedDateTime = (dateStr?: string) => {
    if (!dateStr) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(10, 0, 0, 0);
      return d.toISOString().slice(0, 16);
    }
    return new Date(dateStr).toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      applicationId: defaultApplicationId || '',
      date: getFormattedDateTime(),
      type: 'Video Call',
      round: 1,
      interviewer: '',
      meetingUrl: '',
      location: 'Google Meet',
      notes: '',
      result: 'Scheduled',
    },
  });

  useEffect(() => {
    if (interviewToEdit) {
      const appId =
        typeof interviewToEdit.applicationId === 'object'
          ? interviewToEdit.applicationId._id
          : interviewToEdit.applicationId;

      reset({
        applicationId: appId,
        date: getFormattedDateTime(interviewToEdit.date),
        type: interviewToEdit.type as InterviewType,
        round: interviewToEdit.round,
        interviewer: interviewToEdit.interviewer || '',
        meetingUrl: interviewToEdit.meetingUrl || '',
        location: interviewToEdit.location || '',
        notes: interviewToEdit.notes || '',
        result: interviewToEdit.result as InterviewResult,
      });
    } else {
      reset({
        applicationId: defaultApplicationId || '',
        date: getFormattedDateTime(),
        type: 'Video Call',
        round: 1,
        interviewer: '',
        meetingUrl: '',
        location: 'Google Meet',
        notes: '',
        result: 'Scheduled',
      });
    }
  }, [interviewToEdit, defaultApplicationId, reset, isOpen]);

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      date: new Date(data.date).toISOString(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={interviewToEdit ? 'Edit Interview' : 'Schedule New Interview'}
      description="Keep track of rounds, interviewers, and video meeting links."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
        {/* Application Selector */}
        {!defaultApplicationId && (
          <Select
            label="Job Application"
            required
            error={errors.applicationId?.message}
            {...register('applicationId')}
            disabled={!!interviewToEdit}
          >
            <option value="" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
              Select an application...
            </option>
            {applications.map((app) => (
              <option
                key={app._id}
                value={app._id}
                className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
              >
                {app.company} — {app.position}
              </option>
            ))}
          </Select>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date & Time"
            type="datetime-local"
            required
            error={errors.date?.message}
            {...register('date')}
          />

          <Select
            label="Interview Type"
            error={errors.type?.message}
            {...register('type')}
            options={[
              { value: 'Phone Screen', label: 'Phone Screen' },
              { value: 'Video Call', label: 'Video Call' },
              { value: 'Technical', label: 'Technical' },
              { value: 'Behavioral', label: 'Behavioral' },
              { value: 'System Design', label: 'System Design' },
              { value: 'HR', label: 'HR' },
              { value: 'On-site', label: 'On-site' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Round Number"
            type="number"
            min={1}
            error={errors.round?.message}
            {...register('round', { valueAsNumber: true })}
          />

          <Input
            label="Interviewer Name / Role"
            placeholder="e.g. Sarah Jenkins (Tech Lead)"
            error={errors.interviewer?.message}
            {...register('interviewer')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Meeting URL"
            type="url"
            placeholder="https://meet.google.com/..."
            error={errors.meetingUrl?.message}
            {...register('meetingUrl')}
          />

          <Input
            label="Location / Platform"
            placeholder="e.g. Zoom, Google Meet, On-site HQ"
            error={errors.location?.message}
            {...register('location')}
          />
        </div>

        <Select
          label="Interview Result / Status"
          error={errors.result?.message}
          {...register('result')}
          options={[
            { value: 'Scheduled', label: 'Scheduled' },
            { value: 'Passed', label: 'Passed' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Failed', label: 'Failed' },
            { value: 'Cancelled', label: 'Cancelled' },
          ]}
        />

        <Textarea
          label="Preparation & Notes"
          rows={3}
          placeholder="Questions to ask, topics covered, preparation material..."
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {interviewToEdit ? 'Save Changes' : 'Schedule Interview'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
