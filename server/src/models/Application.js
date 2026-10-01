import mongoose from 'mongoose';

export const APPLICATION_STATUSES = [
  'Wishlist',
  'Applied',
  'Screening',
  'Interview',
  'Technical Round',
  'Offer',
  'Rejected',
  'Withdrawn',
];

export const APPLICATION_PRIORITIES = ['Low', 'Medium', 'High'];

export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
  'Temporary',
];

export const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];

export const APPLICATION_SOURCES = [
  'LinkedIn',
  'Indeed',
  'Glassdoor',
  'Company Website',
  'Referral',
  'Wellfound',
  'AngelList',
  'Recruiter',
  'Other',
];

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
    },
    position: {
      type: String,
      required: [true, 'Position title is required'],
      trim: true,
      maxlength: [120, 'Position cannot exceed 120 characters'],
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    jobUrl: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUSES,
        message: '{VALUE} is not a supported status',
      },
      default: 'Applied',
    },
    priority: {
      type: String,
      enum: {
        values: APPLICATION_PRIORITIES,
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
    },
    employmentType: {
      type: String,
      enum: {
        values: EMPLOYMENT_TYPES,
        message: '{VALUE} is not a valid employment type',
      },
      default: 'Full-time',
    },
    workMode: {
      type: String,
      enum: {
        values: WORK_MODES,
        message: '{VALUE} is not a valid work mode',
      },
      default: 'Remote',
    },
    salaryMin: {
      type: Number,
      min: [0, 'Salary minimum cannot be negative'],
      default: null,
    },
    salaryMax: {
      type: Number,
      min: [0, 'Salary maximum cannot be negative'],
      default: null,
    },
    currency: {
      type: String,
      trim: true,
      default: 'USD',
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      trim: true,
      default: 'LinkedIn',
    },
    contactName: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    coverLetterUrl: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    followUpDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for optimal query performance
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, dateApplied: -1 });
applicationSchema.index({ userId: 1, company: 1 });
applicationSchema.index({ userId: 1, followUpDate: 1 });
applicationSchema.index({ userId: 1, priority: 1 });
applicationSchema.index({ userId: 1, source: 1 });

export const Application = mongoose.model('Application', applicationSchema);
