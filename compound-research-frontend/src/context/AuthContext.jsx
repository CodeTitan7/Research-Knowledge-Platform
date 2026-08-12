import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const userRole = user?.role || '';
  const isResearchUser = userRole === 'ResearchUser';
  const isReviewer = userRole === 'Reviewer';
  const isAdmin = userRole === 'Administrator';

  // Permissions based on user specifications:
  // Reviewer and Administrator can edit/create/upload/review content and remove outdated content.
  // Administrator alone can manage users, role access, and system settings.
  const canEditContent = isReviewer || isAdmin;
  const canDeleteContent = isReviewer || isAdmin;
  const canManageUsers = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isAuthenticated: !!user,
        loading,
        isResearchUser,
        isReviewer,
        isAdmin,
        canEditContent,
        canDeleteContent,
        canManageUsers,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
