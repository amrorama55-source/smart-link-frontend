// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);

  // ========================================
  // Fetch User Data with Better Error Handling
  // ========================================
  const fetchUser = useCallback(async (forceRefresh = false) => {
    if (isFetchingRef.current && !forceRefresh) {
      console.log('⏭️ Already fetching user, skipping...');
      return;
    }

    isFetchingRef.current = true;

    try {
      console.log('🔍 Fetching user data...');
      const res = await api.get('/api/auth/me');
      setUser(res.data.user);
      console.log('✅ User data loaded:', res.data.user);
      return res.data.user;
    } catch (err) {
      console.error('❌ Failed to fetch user:', err.response?.data || err.message);
      
      // ✅ Handle different error cases
      if (err.response?.status === 401 || err.response?.status === 404) {
        console.log('⚠️ Token invalid or user not found, clearing auth...');
        
        // Clear everything
        localStorage.removeItem('token');
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      }
      
      throw err;
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // ========================================
  // Register
  // ========================================
  const register = useCallback(async (userData) => {
    try {
      console.log('📝 Registering user:', userData.email);
      
      const response = await api.post('/api/auth/register', userData);
      console.log('✅ Registration response:', response.data);
      
      if (response.data.token) {
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // Fetch user data
        await fetchUser(true);
      }
      
      return response.data;
    } catch (err) {
      console.error('❌ Registration failed:', err.response?.data || err);
      throw err;
    }
  }, [fetchUser]);

  // ========================================
  // Login with Credentials
  // ========================================
  const loginWithCredentials = useCallback(async (credentials) => {
    try {
      console.log('🔐 Logging in with credentials:', credentials.email);
      
      const response = await api.post('/api/auth/login', credentials);
      console.log('✅ Login response:', response.data);
      
      if (response.data.token) {
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        // Fetch user data
        await fetchUser(true);
      }
      
      return response.data;
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data || err);
      throw err;
    }
  }, [fetchUser]);

  // ========================================
  // Login with Token (OAuth)
  // ========================================
  const loginWithToken = useCallback(async (tokenValue) => {
    try {
      console.log('🔐 Logging in with OAuth token');
      
      // Set token first
      localStorage.setItem('token', tokenValue);
      setToken(tokenValue);
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;

      // Try to fetch user data
      try {
        await fetchUser(true);
        return { success: true };
      } catch (fetchError) {
        // ✅ If user fetch fails, clear everything
        console.error('❌ Failed to fetch user with new token:', fetchError);
        
        localStorage.removeItem('token');
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        
        throw new Error('User not found. Please register first.');
      }
      
    } catch (err) {
      console.error('❌ Token login failed:', err.response?.data || err.message);
      
      // Clear auth state
      localStorage.removeItem('token');
      setToken(null);
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      
      throw err;
    }
  }, [fetchUser]);

  // ========================================
  // Logout
  // ========================================
  const logout = useCallback(() => {
    console.log('🚪 Logging out');
    localStorage.removeItem('token');
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  // ========================================
  // ✅ Initialize Auth - with Better Error Handling
  // ========================================
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (!savedToken) {
        console.log('ℹ️ No token found');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 Initializing auth with saved token...');
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        setToken(savedToken);
        
        // Try to fetch user
        await fetchUser(true);
        
      } catch (err) {
        console.error('❌ Failed to initialize auth:', err);
        
        // ✅ CRITICAL: If token is invalid, clear everything
        console.log('🧹 Clearing invalid token...');
        localStorage.removeItem('token');
        setToken(null);
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // Empty deps - runs only once

  const value = {
    user,
    token,
    loading,
    setUser,
    setToken,
    fetchUser,
    register,
    login: loginWithCredentials,
    loginWithToken,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


