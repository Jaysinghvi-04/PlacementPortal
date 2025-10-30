import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './pages/Login';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Postings from './pages/Postings';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import Admin from './pages/admin/Admin';
import Analytics from './pages/admin/Analytics';
import { UserRole } from './types';
import { USER_ROLES } from './constants'; // Import USER_ROLES

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!user) {
    return <Login />;
  }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'postings':
        return <Postings />;
      case 'profile':
        return <Profile />;
      case 'applications':
        return <Applications />;
      case 'admin':
        // Only for admin role
        return user.role === USER_ROLES.ADMIN ? <Admin /> : <Dashboard />;
      case 'analytics':
        // Only for admin role
        return user.role === USER_ROLES.ADMIN ? <Analytics /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        {renderPage()}
    </MainLayout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
