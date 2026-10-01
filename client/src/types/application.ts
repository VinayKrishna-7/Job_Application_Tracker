export type ApplicationStatus =
  | 'Wishlist'
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Technical Round'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export type ApplicationPriority = 'Low' | 'Medium' | 'High';

export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Internship'
  | 'Freelance'
  | 'Temporary';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export interface JobApplication {
  _id: string;
  userId: string;
  company: string;
  position: string;
  location?: string;
  jobUrl?: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  employmentType: EmploymentType;
  workMode: WorkMode;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency: string;
  dateApplied: string;
  source: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  tags: string[];
  followUpDate?: string | null;
  createdAt: string;
  updatedAt: string;
  interviews?: any[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApplicationListResponse {
  data: JobApplication[];
  pagination: PaginationMeta;
}

export interface ApplicationFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  workMode?: string;
  employmentType?: string;
  source?: string;
  tag?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
