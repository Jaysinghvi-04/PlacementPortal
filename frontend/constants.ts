export const USER_ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  RECRUITER: 'recruiter',
  STUDENT: 'student',
};

export const APPLICATION_STATUSES = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  OFFERED: 'offered',
  INTERVIEW: 'interview',
  UNDER_REVIEW: 'under_review',
  WITHDRAWN: 'withdrawn',
  APPLIED: 'APPLIED',
};

export const POSTING_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  INTERNSHIP: 'internship',
};

export const VERIFICATION_STATUSES = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  USER_PROFILE: (userId: string) => `/users/${userId}/profile`,
  CHANGE_PASSWORD: (userId: string) => `/users/${userId}/change-password`,
  APPLICATIONS: '/applications',
  APPLICATION_BY_ID: (applicationId: string) => `/applications/${applicationId}`,
  POSTINGS: '/postings',
  POSTING_BY_ID: (postingId: string) => `/postings/${postingId}`,
  ADMIN_USERS: '/admin/users',
  ADMIN_ROLES: '/admin/roles',
  ADMIN_USER_ROLE: (userId: string) => `/admin/users/${userId}/role`,
  FACULTY_DASHBOARD: (facultyId: string) => `/faculty/${facultyId}/dashboard`,
  RECRUITER_DASHBOARD: (recruiterId: string) => `/recruiter/${recruiterId}/dashboard`,
  STUDENT_DASHBOARD: (studentId: string) => `/student/${studentId}/dashboard`,
};

export const PAGINATION_LIMIT = 10;