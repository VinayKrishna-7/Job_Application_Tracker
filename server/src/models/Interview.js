import mongoose from 'mongoose';

export const INTERVIEW_TYPES = [
  'Phone Screen',
  'Video Call',
  'Technical',
  'Behavioral',
  'System Design',
  'HR',
  'On-site',
  'Other',
];

export const INTERVIEW_RESULTS = [
  'Scheduled',
  'Completed',
  'Passed',
  'Failed',
  'Cancelled',
];

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application ID is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Interview date and time is required'],
    },
    type: {
      type: String,
      enum: {
        values: INTERVIEW_TYPES,
        message: '{VALUE} is not a valid interview type',
      },
      default: 'Video Call',
    },
    round: {
      type: Number,
      default: 1,
      min: [1, 'Round must be at least 1'],
    },
    interviewer: {
      type: String,
      trim: true,
      default: '',
    },
    meetingUrl: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    result: {
      type: String,
      enum: {
        values: INTERVIEW_RESULTS,
        message: '{VALUE} is not a valid interview result',
      },
      default: 'Scheduled',
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

interviewSchema.index({ userId: 1, date: 1 });
interviewSchema.index({ applicationId: 1, date: 1 });

export const Interview = mongoose.model('Interview', interviewSchema);
