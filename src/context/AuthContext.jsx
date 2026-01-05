import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, login as loginApi, register as registerApi } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('ℹ️ No token found');
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Initializing auth with token...');
      const data = await getCurrentUser();
      
      console.log('✅ User data received:', data.user);
      setUser(data.user);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to initialize auth:', err);
      
      // إذا كان الخطأ 404 (user not found), امسح التوكن
      if (err.response?.status === 404) {
        console.log('🗑️ Clearing invalid token');
        localStorage.removeItem('token');
      }
      
      setUser(null);
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Login with email/password
  const login = async (credentials) => {
    try {
      console.log('🔐 Logging in...');
      const data = await loginApi(credentials);
      
      console.log('✅ Login successful:', data.user);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setError(null);
      
      return data;
    } catch (err) {
      console.error('❌ Login failed:', err);
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Login with token (OAuth callback)
  const loginWithToken = async (token) => {
    try {
      console.log('🔑 Logging in with token...');
      
      // Save token first
      localStorage.setItem('token', token);
      
      // Try to fetch user with new token
      try {
        console.log('📡 Fetching user with new token...');
        const data = await getCurrentUser();
        
        console.log('✅ User fetched successfully:', data.user);
        setUser(data.user);
        setError(null);
        
        return data;
      } catch (fetchError) {
        console.error('❌ Failed to fetch user with new token:', fetchError);
        
        // If user not found, clear token and throw error
        if (fetchError.response?.status === 404) {
          console.log('🗑️ User not found - clearing token');
          localStorage.removeItem('token');
          throw new Error('User not found. Please register first.');
        }
        
        throw fetchError;
      }
    } catch (err) {
      console.error('❌ Token login failed:', err.message);
      localStorage.removeItem('token');
      setUser(null);
      
      const errorMessage = err.message || err.response?.data?.error || 'Authentication failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Register
  const register = async (userData) => {
    try {
      console.log('📝 Registering...');
      const data = await registerApi(userData);
      
      console.log('✅ Registration successful:', data.user);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setError(null);
      
      return data;
    } catch (err) {
      console.error('❌ Registration failed:', err);
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Logout
  const logout = () => {
    console.log('👋 Logging out');
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  // Update user
  const updateUser = (updates) => {
    console.log('🔄 Updating user:', updates);
    setUser(prev => ({ ...prev, ...updates }));
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
    isAuthenticated: !!user
  };

  return (
    <tag name="AuthContext.Provider" value={value}>
      {children}
    </tag>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}


