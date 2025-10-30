import React, { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { Application, ApplicationStatus } from '../../types';

const StatCard: React.FC<{ title: string, value: string | number, color: string }> = ({ title, value, color }) => (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border-t-4 ${color} transition-transform transform hover:-translate-y-1`}>
        <h2 className="text-lg font-semibold text-slate-500 dark:text-slate-400">{title}</h2>
        <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
    </div>
);

const ApplicationProgressTracker: React.FC<{ applications: Application[] }> = ({ applications }) => {
  const progress = useMemo(() => {
    const counts = {
      applied: 0,
      review: 0,
      offers: 0,
    };
    applications.forEach(app => {
      switch (app.stage) {
        case 'APPLIED':
          counts.applied++;
          break;
        case 'UNDER_REVIEW':
        case 'INTERVIEW':
          counts.review++;
          break;
        case 'OFFERED':
          counts.offers++;
          break;
        default:
          break;
      }
    });
    return [
      { name: 'Pending', count: counts.applied, color: 'bg-slate-500', icon: <PaperAirplaneIcon /> },
      { name: 'Under Review', count: counts.review, color: 'bg-amber-500', icon: <MagnifyingGlassIcon /> },
      { name: 'Offers', count: counts.offers, color: 'bg-emerald-500', icon: <SparklesIcon /> },
    ];
  }, [applications]);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Application Funnel</h2>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        {progress.map((stage) => (
          <div key={stage.name} className="flex-1 flex items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className={`p-3 rounded-full ${stage.color} text-white mr-4`}>
                {stage.icon}
            </div>
            <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stage.count}</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stage.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { applications, postings, isLoading } = useData();

  if (isLoading) {
      return <div>Loading dashboard...</div>;
  }

  const myApplications = applications.filter(app => app.studentId === user?.id);
  const activeApplications = myApplications.filter(app => !['rejected', 'withdrawn', 'accepted'].includes(app.stage));
  const offers = myApplications.filter(app => app.stage === 'OFFERED');

  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome, {user?.name}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Applications" value={myApplications.length} color="border-indigo-500" />
            <StatCard title="Active Applications" value={activeApplications.length} color="border-amber-500" />
            <StatCard title="Offers Received" value={offers.length} color="border-emerald-500" />
        </div>

        <ApplicationProgressTracker applications={myApplications} />
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
             <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {myApplications.slice(0, 5).map(app => {
                    const posting = postings.find(p => p.id === app.jobId);
                    return (
                        <li key={app.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="text-slate-800 dark:text-slate-200">Applied for <strong className="font-semibold">{posting?.title}</strong> at {posting?.company}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</p>
                            </div>
                             <span className={`px-2 py-1 text-xs font-semibold rounded-full ${app.stage === 'OFFERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'} dark:bg-slate-700 dark:text-slate-300`}>
                                {app.stage}
                            </span>
                        </li>
                    )
                })}
             </ul>
        </div>
    </div>
  );
};

const PaperAirplaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const MagnifyingGlassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293-1.293a1 1 0 010-1.414L14 7m5 5l2.293 2.293a1 1 0 010 1.414L19 19l-1.293-1.293a1 1 0 010-1.414L20 14m-5-5l2.293 2.293a1 1 0 010 1.414L15 14l-1.293-1.293a1 1 0 010-1.414L16 9m-5 5l2.293 2.293a1 1 0 010 1.414L11 19l-1.293-1.293a1 1 0 010-1.414L12 14" /></svg>;

export default StudentDashboard;