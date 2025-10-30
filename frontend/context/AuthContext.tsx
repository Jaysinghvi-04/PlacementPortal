
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// FIX: Corrected import path for User type.
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateUser: (updatedUser: UserProfile) => void;
}

// FIX: Export AuthContext to be used in hooks/useAuth.ts
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      console.log("AuthContext: Initializing with storedUser", storedUser);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Assuming the stored user data is nested under a 'data' property
        return parsedUser.data || null;
      }
      return null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  const login = (userData: UserProfile) => {
    console.log("AuthContext: Logging in with userData", userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify({ data: userData })); // Store with 'data' property to match backend response
  };

  const logout = () => {
    console.log("AuthContext: Logging out");
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const updateUser = (updatedUser: UserProfile) => {
    console.log("AuthContext: Updating user with updatedUser", updatedUser);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify({ data: updatedUser })); // Store with 'data' property
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};