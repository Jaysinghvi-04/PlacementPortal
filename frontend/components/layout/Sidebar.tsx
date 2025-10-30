import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { USER_ROLES } from '../../constants'; // Import USER_ROLES

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const NavLink: React.FC<{
  // FIX: Explicitly type the 'icon' prop to accept a 'className' to resolve the 'React.cloneElement' error.
  icon: React.ReactElement<{ className?: string }>;
  text: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, text, isActive, onClick }) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-lg ${
      isActive
        ? 'bg-indigo-100 text-indigo-700 dark:bg-slate-800 dark:text-indigo-300'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
    }`}
  >
    {React.cloneElement(icon, { className: 'w-6 h-6' })}
    <span className="ml-3">{text}</span>
  </a>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();

  const getNavLinks = () => {
    const commonLinks = [
      { id: 'dashboard', text: 'Dashboard', icon: <HomeIcon /> },
      { id: 'postings', text: 'Postings', icon: <BriefcaseIcon /> },
      { id: 'profile', text: 'My Profile', icon: <UserCircleIcon /> },
    ];

    switch (user?.role) {
      case USER_ROLES.STUDENT:
        return [...commonLinks, { id: 'applications', text: 'My Applications', icon: <DocumentTextIcon /> }];
      case USER_ROLES.RECRUITER:
        return [...commonLinks, { id: 'applications', text: 'Manage Applications', icon: <UsersIcon /> }];
      case USER_ROLES.FACULTY:
        return [{ id: 'dashboard', text: 'Verification Queue', icon: <CheckBadgeIcon /> }];
      case USER_ROLES.ADMIN:
        return [
          { id: 'dashboard', text: 'Dashboard', icon: <HomeIcon /> },
          { id: 'admin', text: 'Admin Panel', icon: <CogIcon /> },
          { id: 'analytics', text: 'Analytics', icon: <ChartBarIcon /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-700">
      <div className="flex items-center justify-center h-16 border-b dark:border-slate-700">
        <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        <span className="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">PlacementIO</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {getNavLinks().map((link) => (
            <NavLink
              key={link.id}
              text={link.text}
              icon={link.icon}
              isActive={currentPage === link.id}
              onClick={() => setCurrentPage(link.id)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

// SVG Icons
const HomeIcon = ({className = 'w-6 h-6'}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const BriefcaseIcon = ({className = 'w-6 h-6'}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const UserCircleIcon = ({className = 'w-6 h-6'}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const DocumentTextIcon = ({className = 'w-6 h-6'}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const UsersIcon = ({className = 'w-6 h-6'}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A10.99 10.99 0 0012 13a10.99 10.99 0 00-3-5.197z"></path></svg>;
const CogIcon = ({className = 'w-6 h-6'}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const ChartBarIcon = ({className = 'w-6 h-6'}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>;
const CheckBadgeIcon = ({className = 'w-6 h-6'}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>

export default Sidebar;