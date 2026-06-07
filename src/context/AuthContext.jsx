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
    try {
      const data = await getCurrentUser();
      setUser(data.user);
      setError(null);
    } catch (err) {
      // If authentication fails, ensure any stale token cookie is cleared by server endpoint (optional)
      setUser(null);
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await loginApi(credentials);
      // Server sets HttpOnly cookie; no need to store token client-side
      setUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Google OAuth token handler - cookie is already set by server before redirect
  const loginWithToken = async () => {
    try {
      // The server already set the HttpOnly cookie before redirecting here.
      // We just need to call /auth/me to hydrate the user state.
      const data = await getCurrentUser();
      setUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      setUser(null);
      const errorMessage = err.response?.data?.error || err.message || 'Authentication failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerApi(userData);
      // Server sets HttpOnly cookie; no need to store token client-side
      setUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      // Call server to clear the HttpOnly cookie
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout endpoint error (ignoring):', err.message);
    } finally {
      setUser(null);
      setError(null);
    }
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

