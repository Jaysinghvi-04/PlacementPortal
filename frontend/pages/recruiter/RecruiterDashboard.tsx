import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';

const StatCard: React.FC<{ title: string, value: string | number, color: string }> = ({ title, value, color }) => (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-t-4 ${color} transition-transform transform hover:-translate-y-1`}>
        <h2 className="text-lg font-semibold text-slate-500 dark:text-slate-400">{title}</h2>
        <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
    </div>
);

const RecruiterDashboard: React.FC = () => {
    const { user } = useAuth();
    const { postings, applications, isLoading } = useData();

    if (isLoading) {
      return <div>Loading dashboard...</div>;
    }

    const myPostings = postings.filter(p => p.recruiterId === user?.id);
    const myPostingIds = myPostings.map(p => p.id);
    const myApplications = applications.filter(app => myPostingIds.includes(app.jobId));

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Recruiter Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Your Open Postings" value={myPostings.filter(p => p.status === 'Open').length} color="border-indigo-500" />
                <StatCard title="Total Applications Received" value={myApplications.length} color="border-purple-500" />
            </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Recent Postings</h2>
                 <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {myPostings.slice(0, 5).map(p => {
                        const appCount = myApplications.filter(a => a.jobId === p.id).length;
                        return (
                            <li key={p.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="text-slate-800 dark:text-slate-200 font-semibold">{p.title}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{p.company} - {p.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-slate-700 dark:text-slate-300">{appCount} Application{appCount !== 1 && 's'}</p>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.status === 'Open' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>{p.status}</span>
                                </div>
                            </li>
                        )
                    })}
                 </ul>
            </div>
        </div>
    );
};

export default RecruiterDashboard;