import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';
import { Application, ApplicationStatus, Posting, UserProfile, UserRole } from '../types';
import { APPLICATION_STATUSES, USER_ROLES } from '../constants'; // Import USER_ROLES
import * as api from '../api';

const ApplicationCard: React.FC<{ application: Application, posting?: Posting, student?: UserProfile }> = ({ application, posting, student }) => {
    const { user } = useAuth();
    const { fetchApplications } = useData(); // Assuming updateApplicationStatus is handled by refetching applications

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case APPLICATION_STATUSES.OFFERED: return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
            case APPLICATION_STATUSES.REJECTED: return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
            case APPLICATION_STATUSES.ACCEPTED: return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300';
            case APPLICATION_STATUSES.INTERVIEW: return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
        }
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (application.id) {
            try {
                await api.updateApplicationStatus(application.id, { status: e.target.value as ApplicationStatus });
                fetchApplications(); // Refetch applications to update the UI
            } catch (error) {
                console.error('Failed to update application status:', error);
            }
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{posting?.title || 'Job Title'}</h3>
                    <p className="text-md text-slate-600 dark:text-slate-400">{posting?.company || 'Company'}</p>
                    {user?.role === USER_ROLES.RECRUITER && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Applicant: {student?.name}</p>}
                    <p className="text-sm text-slate-500 dark:text-slate-400">Applied: {new Date(application.createdAt || '').toLocaleDateString()}</p>
                </div>
                {user?.role === USER_ROLES.RECRUITER ? (
                     <select value={application.stage} onChange={handleStatusChange} className={`px-2 py-1 text-xs font-semibold rounded-full border-transparent focus:border-indigo-500 focus:ring-indigo-500 ${getStatusColor(application.stage || 'pending')}`}>
                         {Object.values(APPLICATION_STATUSES).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                ) : (
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.stage || 'pending')}`}>
                        {application.stage}
                    </span>
                )}
            </div>
            <div className="mt-4 border-t pt-4 dark:border-slate-700">
                 <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Application History</h4>
                 <ul className="space-y-2">
                     {application.statusHistory?.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(h => (
                         <li key={h.date} className="flex items-center text-sm">
                             <span className="w-24 font-medium text-slate-500 dark:text-slate-400">{new Date(h.date).toLocaleDateString()}</span>
                             <span className="text-slate-800 dark:text-slate-200">{h.status}</span>
                         </li>
                     ))}
                 </ul>
            </div>
        </div>
    );
};

const Applications: React.FC = () => {
    const { user } = useAuth();
    const { applications, postings, users, loading: isLoading, fetchApplications } = useData();
    const [statusFilter, setStatusFilter] = useState('');

    const myApplications = useMemo(() => {
        let apps: Application[] = [];
        if (user?.role === USER_ROLES.STUDENT) {
            apps = applications.filter(a => a.studentId === user.id);
        } else if (user?.role === USER_ROLES.RECRUITER) {
            const myPostingIds = postings.filter(p => p.recruiterId === user.id).map(p => p.id);
            apps = applications.filter(a => myPostingIds.includes(a.postingId || '')); // Changed a.jobId to a.postingId
        } else {
            apps = [];
        }
        return statusFilter ? apps.filter(a => a.stage === statusFilter) : apps;
    }, [user, applications, postings, statusFilter]);

    useEffect(() => {
        fetchApplications(); // Fetch applications when component mounts or user changes
    }, [user, fetchApplications]);

    if (isLoading) return <p>Loading applications...</p>;

    const pageTitle = user?.role === USER_ROLES.STUDENT ? "My Applications" : "Manage Applications";
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{pageTitle}</h1>
                 <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-indigo-500">
                    <option value="">All Statuses</option>
                    {Object.values(APPLICATION_STATUSES).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
            </div>
            {myApplications.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myApplications.map(app => (
                        <ApplicationCard 
                            key={app.id} 
                            application={app} 
                            posting={postings.find(p => p.id === app.postingId)}
                            student={users.find(u => u.id === app.studentId)}
                        />
                    ))}
                 </div>
            ) : (
                <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-xl shadow-lg">
                    <p className="text-slate-500 dark:text-slate-400">No applications found.</p>
                </div>
            )}
        </div>
    );
};

export default Applications;
