import axios from 'axios';
import { UserCredentials, UserRegistration, UserProfile, ChangePassword, ApplicationQueryParams, ApplicationData, ApplicationStatusUpdate, PostingQueryParams, PostingData, UserQueryParams, Department, Skill, ApiResponse, VerificationDoc, VerificationStatus, Application, Posting } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Endpoints
export const login = (credentials: UserCredentials) => api.post('/auth/login', credentials);
export const register = (userData: UserRegistration) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');
export const refreshAccessToken = () => api.post('/auth/refresh-token');

// User Endpoints
export const getUserProfile = (userId: string) => api.get(`/users/${userId}/profile`);
export const updateUserProfile = (userId: string, profile: UserProfile) => api.put(`/users/${userId}/profile`, profile);
export const changePassword = (userId: string, passwords: ChangePassword) => api.put(`/users/${userId}/change-password`, passwords);

// Application Endpoints
export const getApplications = (params?: ApplicationQueryParams) => api.get<ApiResponse<Application>>('/applications', { params });
export const getApplicationById = (applicationId: string) => api.get<Application>(`/applications/${applicationId}`);
export const createApplication = (applicationData: ApplicationData) => api.post<Application>('/applications', applicationData);
export const updateApplicationStatus = (applicationId: string, status: ApplicationStatusUpdate) => api.patch<Application>(`/applications/${applicationId}/status`, { status });

// Posting Endpoints
export const getPostings = (params?: PostingQueryParams) => api.get<ApiResponse<Posting>>('/postings', { params });
export const getPostingById = (postingId: string) => api.get<Posting>(`/postings/${postingId}`);
export const createPosting = (postingData: PostingData) => api.post<Posting>('/postings', postingData);
export const updatePosting = (postingId: string, postingData: PostingData) => api.put<Posting>(`/postings/${postingId}`, postingData);
export const deletePosting = (postingId: string) => api.delete(`/postings/${postingId}`);

// Admin Endpoints
export const getUsers = (params?: UserQueryParams) => api.get<ApiResponse<UserProfile>>('/admin/users', { params });
export const getUserRoles = () => api.get<string[]>('/admin/roles');
export const updateUserRole = (userId: string, roleId: string) => api.patch(`/admin/users/${userId}/role`, { roleId });

// Faculty Endpoints
export const getFacultyDashboardData = (facultyId: string) => api.get(`/faculty/${facultyId}/dashboard`);
export const getVerificationDocs = () => api.get<ApiResponse<VerificationDoc>>('/verification-docs');
export const updateVerificationDocStatus = (docId: string, data: { status: VerificationStatus; remarks: string }) => api.patch(`/verification-docs/${docId}/status`, data);

// Recruiter Endpoints
export const getRecruiterDashboardData = (recruiterId: string) => api.get(`/recruiter/${recruiterId}/dashboard`);

// Student Endpoints
export const getStudentDashboardData = (studentId: string) => api.get(`/student/${studentId}/dashboard`);

// General Data Endpoints
export const getDepartments = () => api.get<ApiResponse<Department>>('/departments');
export const getSkills = () => api.get<ApiResponse<Skill>>('/skills');

export default api;