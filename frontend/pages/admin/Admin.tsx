import React from 'react';
import AdminDashboard from './AdminDashboard';
import Analytics from './Analytics';

const Admin: React.FC = () => {
  return (
    <div className="admin-page">
      <h1>Admin Panel</h1>
      <p>Welcome to the administration section. Here you can manage users, roles, and view analytics.</p>
      <AdminDashboard />
      <Analytics />
    </div>
  );
};

export default Admin;