import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { USER_ROLES } from '../constants'; // Import USER_ROLES
import StudentDashboard from './student/StudentDashboard';
import RecruiterDashboard from './recruiter/RecruiterDashboard';
import FacultyDashboard from './faculty/FacultyDashboard';
import AdminDashboard from './admin/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case USER_ROLES.STUDENT:
      return <StudentDashboard />;
    case USER_ROLES.RECRUITER:
      return <RecruiterDashboard />;
    case USER_ROLES.FACULTY:
      return <FacultyDashboard />;
    case USER_ROLES.ADMIN:
      return <AdminDashboard />;
    default:
      return <div>Welcome! Please log in.</div>;
  }
};

export default Dashboard;
