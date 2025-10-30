import React from 'react';
import { useData } from '../../hooks/useData';

const StatCard: React.FC<{ title: string, value: string | number, color: string, icon: React.ReactNode }> = ({ title, value, color, icon }) => (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-t-4 ${color} transition-transform transform hover:-translate-y-1 flex items-center`}>
        <div className={`p-3 rounded-full mr-4 ${color.replace('border-', 'bg-').replace('-500', '-100')} dark:bg-slate-700`}>
            {icon}
        </div>
        <div>
            <h2 className="text-lg font-semibold text-slate-500 dark:text-slate-400">{title}</h2>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
  const { users, postings, applications, isLoading } = useData();
  
  if (isLoading) {
    return <div>Loading admin dashboard...</div>
  }
  
  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Users" value={users.length} color="border-indigo-500" icon={<UsersIcon />} />
            <StatCard title="Total Postings" value={postings.length} color="border-purple-500" icon={<BriefcaseIcon />} />
            <StatCard title="Total Applications" value={applications.length} color="border-emerald-500" icon={<DocumentTextIcon />} />
        </div>
    </div>
  );
};

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A10.99 10.99 0 0012 13a10.99 10.99 0 00-3-5.197z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

export default AdminDashboard;