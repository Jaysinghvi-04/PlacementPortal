import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as api from '../api';
import { Application, Posting, ApplicationQueryParams, PostingQueryParams, UserProfile, Department, Skill, VerificationDoc, VerificationStatus } from '../types';

interface DataContextType {
  applications: Application[];
  postings: Posting[];
  users: UserProfile[];
  departments: Department[];
  skills: Skill[];
  verificationDocs: VerificationDoc[];
  fetchApplications: (params?: ApplicationQueryParams) => Promise<void>;
  fetchPostings: (params?: PostingQueryParams) => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchDepartments: () => Promise<void>;
  fetchSkills: () => Promise<void>;
  fetchVerificationDocs: () => Promise<void>;
  updateVerificationStatus: (docId: string, status: VerificationStatus, remarks: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [postings, setPostings] = useState<Posting[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [verificationDocs, setVerificationDocs] = useState<VerificationDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async (params?: ApplicationQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getApplications(params);
      setApplications(response.data.data);
    } catch (err) {
      setError('Failed to fetch applications.');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPostings = async (params?: PostingQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getPostings(params);
      setPostings(response.data.data);
    } catch (err) {
      setError('Failed to fetch postings.');
      console.error('Error fetching postings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getUsers();
      setUsers(response.data.data);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getDepartments();
      setDepartments(response.data.data);
    } catch (err) {
      setError('Failed to fetch departments.');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getSkills();
      setSkills(response.data.data);
    } catch (err) {
      setError('Failed to fetch skills.');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getVerificationDocs(); // Assuming this endpoint exists
      setVerificationDocs(response.data.data);
    } catch (err) {
      setError('Failed to fetch verification documents.');
      console.error('Error fetching verification documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (docId: string, status: VerificationStatus, remarks: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.updateVerificationDocStatus(docId, { status, remarks }); // Assuming this endpoint exists
      fetchVerificationDocs(); // Refresh docs after update
    } catch (err) {
      setError('Failed to update verification status.');
      console.error('Error updating verification status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchApplications(),
          fetchPostings(),
          fetchUsers(),
          fetchDepartments(),
          fetchSkills(),
          fetchVerificationDocs(),
        ]);
      } catch (err) {
        setError('Failed to load initial data.');
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const value = {
    applications,
    postings,
    users,
    departments,
    skills,
    verificationDocs,
    fetchApplications,
    fetchPostings,
    fetchUsers,
    fetchDepartments,
    fetchSkills,
    fetchVerificationDocs,
    updateVerificationStatus,
    loading,
    error,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};