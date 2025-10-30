// Auth related types
export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  email: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'faculty' | 'recruiter' | 'student';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name?: string; // Added based on Analytics.tsx error
  studentProfile?: StudentProfile; // Added based on Analytics.tsx error
  // Add other profile fields as needed
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword?: string; // Assuming a confirm password field might be present
}

// Application related types
export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'offered' | 'interview' | 'under_review' | 'withdrawn' | 'APPLIED' | 'UNDER_REVIEW' | 'INTERVIEW' | 'OFFERED';

export interface ApplicationQueryParams {
  status?: ApplicationStatus;
  postingId?: string;
  studentId?: string;
  page?: number;
  limit?: number;
}

export interface Application {
  id: string;
  postingId: string;
  studentId: string;
  status: ApplicationStatus;
  jobId?: string; // Added based on Analytics.tsx error
  stage?: ApplicationStatus; // Added based on Analytics.tsx and Applications.tsx error
  createdAt?: string; // Added based on Analytics.tsx error
  statusHistory?: { status: ApplicationStatus; date: string }[]; // Added based on Analytics.tsx error
  // Add other application fields as needed
}

export interface ApplicationData {
  postingId: string;
  studentId: string;
  status: ApplicationStatus;
  coverLetter?: string; // Added for createApplication
  // Add other application fields as needed
}

export interface ApplicationStatusUpdate {
  status: ApplicationStatus;
}

// Posting related types
export type PostingType = 'full-time' | 'part-time' | 'internship';

export interface PostingQueryParams {
  type?: PostingType;
  recruiterId?: string;
  page?: number;
  limit?: number;
}

export interface Posting {
  id: string;
  title: string;
  description: string;
  type: PostingType;
  recruiterId: string;
  deadline?: string; // Added based on Postings.tsx error
  status?: string; // Added based on Postings.tsx error (e.g., 'Open', 'Closed')
  eligibility?: {
    minGpa: number;
    gradYear: number[];
  }; // Added based on Postings.tsx error
  requiresVerification?: boolean; // Added based on Postings.tsx error
  requiredSkills?: string[]; // Added based on Analytics.tsx error
  company?: string; // Added based on Analytics.tsx error
  location?: string; // Added based on Postings.tsx error
  salary?: string; // Added based on Postings.tsx error
  // Add other posting fields as needed
}

export interface PostingData {
  title: string;
  description: string;
  type: PostingType;
  recruiterId: string;
  // Add other posting fields as needed
}

// User related types (for admin panel, etc.)
export interface UserQueryParams {
  role?: UserRole;
  page?: number;
  limit?: number;
}

export interface StudentProfile {
  id: string;
  userId: string;
  gpa: number;
  gradYear: number;
  departmentId?: string; // Added based on Analytics.tsx error
  program?: string; // Added based on FacultyDashboard.tsx error
  hasAcceptedOffer?: boolean; // Added based on Postings.tsx error
  // Add other student profile fields
}

export interface Department {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
}

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface VerificationDoc {
  id: string;
  userId: string; // Added based on FacultyDashboard.tsx error
  type: string;
  url: string;
  status: VerificationStatus;
  remarks?: string; // Added based on FacultyDashboard.tsx error
  documentName?: string; // Added based on FacultyDashboard.tsx error
  updatedAt?: string; // Added based on FacultyDashboard.tsx error
  // Add other verification doc fields
}

// Generic pagination interface
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

// Generic API response for lists
export interface ApiResponse<T> {
  data: T[];
  pagination: Pagination;
}