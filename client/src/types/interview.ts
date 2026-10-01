export type InterviewType =
  | 'Phone Screen'
  | 'Video Call'
  | 'Technical'
  | 'Behavioral'
  | 'System Design'
  | 'HR'
  | 'On-site'
  | 'Other';

export type InterviewResult =
  | 'Scheduled'
  | 'Completed'
  | 'Passed'
  | 'Failed'
  | 'Cancelled';

export interface Interview {
  _id: string;
  userId: string;
  applicationId: {
    _id: string;
    company: string;
    position: string;
    status: string;
    location?: string;
    workMode?: string;
    priority?: string;
  } | string;
  date: string;
  type: InterviewType;
  round: number;
  interviewer?: string;
  meetingUrl?: string;
  location?: string;
  notes?: string;
  result: InterviewResult;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterviewInput {
  applicationId: string;
  date: string;
  type?: InterviewType;
  round?: number;
  interviewer?: string;
  meetingUrl?: string;
  location?: string;
  notes?: string;
  result?: InterviewResult;
}
