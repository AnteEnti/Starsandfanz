import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfileData } from '../types';
import * as authService from '../services/auth';

interface AuthContextType {
  user: UserProfileData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileUpdate: Partial<UserProfileData>) => Promise<void>;
  clearError: () => void;
  isAdmin: boolean;
  isEditor: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;
  const isAdmin = user?.roles.includes('administrator') ?? false;
  const isEditor = user?.roles.includes('editor') || isAdmin;

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    const token = authService.getToken();
    if (token) {
      const isValid = await authService.validateToken(token);
      if (isValid) {
        try {
          const userData = await authService.getCurrentUser(token);
          setUser(userData);
        } catch (e) {
          authService.removeToken();
          setUser(null);
        }
      } else {
        authService.removeToken();
        setUser(null);
      }
    } else {
        setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const { token, user } = await authService.loginUser(username, password);
      authService.storeToken(token);
      setUser(user);
    } catch (e: any) {
      setError(e.message || 'Login failed');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
  };

  const updateProfile = async (profileUpdate: Partial<UserProfileData>) => {
    const token = authService.getToken();
    if (!token || !user) return;
    try {
      const updatedUser = await authService.updateCurrentUser(token, { ...user, ...profileUpdate });
      setUser(updatedUser);
    } catch (e: any) {
      setError(e.message || 'Failed to update profile');
      throw e;
    }
  };
  
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, error, login, logout, updateProfile, clearError, isAdmin, isEditor }}>
      {children}
    </AuthContext.Provider>
  );
};