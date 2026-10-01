import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
import { authApi } from '../services/authApi';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async () => {
    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { user: loggedInUser } = await authApi.login(credentials);
      setUser(loggedInUser);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { user: registeredUser } = await authApi.register(credentials);
      setUser(registeredUser);
      toast.success(`Welcome to EasyTrack, ${registeredUser.name}!`);
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast.success('You have been logged out.');
    } catch (error: any) {
      toast.error('Logout encountered an issue.');
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    try {
      const refreshed = await authApi.getMe();
      setUser(refreshed);
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
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
