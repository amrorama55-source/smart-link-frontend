import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as loginApi, register as registerApi, api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await getCurrentUser();
      setUser(data.user);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        localStorage.removeItem('token');
      }
      setUser(null);
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await loginApi(credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Google OAuth token handler
  const loginWithToken = async (token) => {
    try {
      localStorage.setItem('token', token);
      try {
        const data = await getCurrentUser();
        setUser(data.user);
        setError(null);
        return data;
      } catch (fetchError) {
        if (fetchError.response?.status === 404) {
          localStorage.removeItem('token');
          throw new Error('User not found. Please register first.');
        }
        throw fetchError;
      }
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
      const errorMessage = err.message || err.response?.data?.error || 'Authentication failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerApi(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const refreshUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('❌ Failed to refresh user:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithToken,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

