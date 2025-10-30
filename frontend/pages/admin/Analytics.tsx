import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../../hooks/useData';
import { Application, Posting, UserProfile, Department, Skill, StudentProfile } from '../../types';
import { APPLICATION_STATUSES } from '../../constants';

const Analytics: React.FC = () => {
  const { applications, users, postings, departments, skills, loading: isLoading } = useData();

  const placementFunnelData = useMemo(() => {
    if (isLoading || !applications.length) return [];
    const funnelCounts = applications.reduce((acc, app) => {
        const stage = app.stage || 'unknown'; // Use app.stage, default to 'unknown' if undefined
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const orderedStages = Object.values(APPLICATION_STATUSES);
    return orderedStages.map(stage => ({
        stage,
        count: funnelCounts[stage] || 0
    })).filter(item => item.count > 0);
  }, [applications, isLoading]);

  const skillsDemandData = useMemo(() => {
    if (isLoading || !postings.length || !skills.length) return [];
    const skillCounts = postings.reduce((acc, posting) => {
        posting.requiredSkills?.forEach(skillId => {
            acc[skillId] = (acc[skillId] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(skillCounts)
        .map(([skillId, count]) => ({
            skill: skills.find(s => s.id === skillId)?.name || 'Unknown Skill',
            count: Number(count) // Explicitly convert to number
        }))
        .sort((a, b) => Number(b.count) - Number(a.count)) // Explicitly convert to number for sorting
        .slice(0, 10);
  }, [postings, skills, isLoading]);

  const pipelineVelocityData = useMemo(() => {
     if (isLoading || !applications.length) return [];
     const transitions: Record<string, { totalDays: number; count: number }> = {};
     applications.forEach(app => {
        if (!app.statusHistory) return; // Ensure statusHistory exists
        const sortedHistory = [...app.statusHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        for (let i = 1; i < sortedHistory.length; i++) {
            const fromStage = sortedHistory[i-1].status;
            const toStage = sortedHistory[i].status;
            const transitionName = `${fromStage} to ${toStage}`;
            const startDate = new Date(sortedHistory[i-1].date);
            const endDate = new Date(sortedHistory[i].date);
            const daysDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
            if (!transitions[transitionName]) {
                transitions[transitionName] = { totalDays: 0, count: 0 };
            }
            transitions[transitionName].totalDays += daysDiff;
            transitions[transitionName].count++;
        }
     });
     return Object.entries(transitions).map(([stage, data]) => ({
        stage,
        days: Math.round(data.totalDays / data.count * 10) / 10
     }));
  }, [applications, isLoading]);

  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["Application ID", "Student Name", "Student Email", "Department", "Grad Year", "GPA", "Posting Title", "Company", "Status", "Applied Date"];
    csvContent += headers.join(",") + "\r\n";
    applications.forEach((app: Application) => {
        const student = users.find(u => u.id === app.studentId);
        const posting = postings.find(p => p.id === app.postingId); // Changed app.jobId to app.postingId
        if (!student || !posting || !student.studentProfile) return;
        const studentProfile = student.studentProfile as StudentProfile;
        const department = departments.find(d => d.id === studentProfile.departmentId);
        const row = [
            app.id, `"${student.name}"`, student.email, `"${department?.name || 'N/A'}"`,
            studentProfile.gradYear, studentProfile.gpa, `"${posting.title}"`, `"${posting.company}"`,
            app.stage, new Date(app.createdAt || '').toLocaleDateString() // Added || '' for safety
        ].join(",");
        csvContent += row + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "applications_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return <div className="text-center p-8">Loading analytics...</div>;
  }

  const ChartWrapper: React.FC<{title: string; data: any[]; children: React.ReactNode}> = ({title, data, children}) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
      {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            {children}
          </ResponsiveContainer>
      ) : <p className="text-slate-500 dark:text-slate-400 text-center py-10">No data available for this chart.</p>}
    </div>
  );

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Placement Analytics</h1>
            <button onClick={handleExport} className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <DownloadIcon /> <span className="ml-2">Export Report (CSV)</span>
            </button>
        </div>
      
      <ChartWrapper title="Placement Funnel" data={placementFunnelData}>
          <BarChart data={placementFunnelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
            <XAxis dataKey="stage" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" name="Applications" />
          </BarChart>
      </ChartWrapper>

      <ChartWrapper title="In-Demand Skills (from Postings)" data={skillsDemandData}>
          <BarChart data={skillsDemandData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
            <XAxis type="number" allowDecimals={false}/>
            <YAxis type="category" dataKey="skill" width={120} />
            <Tooltip />
            <Bar dataKey="count" fill="#a855f7" name="Job Postings" />
          </BarChart>
      </ChartWrapper>
      
      <ChartWrapper title="Hiring Pipeline Velocity (Avg. Days)" data={pipelineVelocityData}>
          <BarChart data={pipelineVelocityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="days" fill="#14b8a6" name="Average Days" />
          </BarChart>
      </ChartWrapper>

    </div>
  );
};

const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

export default Analytics;