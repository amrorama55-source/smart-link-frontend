// frontend/src/services/api.js - FINAL FIXED VERSION

import axios from 'axios';
import { API_URL } from '../config'; // Import from config

const api = axios.create({
  baseURL: `${API_URL}/api`, // أضف /api هنا
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Auth APIs - Remove /api prefix
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const regenerateApiKey = async () => {
  const response = await api.post('/auth/regenerate-key');
  return response.data;
};

// ✅ Links APIs - Remove /api prefix
export const createLink = async (linkData) => {
  const response = await api.post('/links', linkData);
  return response.data;
};

export const getLinks = async (page = 1, limit = 10, search = '', tag = '') => {
  const response = await api.get('/links', {
    params: { page, limit, search, tag }
  });
  return response.data;
};

export const getLink = async (shortCode) => {
  const response = await api.get(`/links/${shortCode}`);
  return response.data;
};

export const updateLink = async (shortCode, updateData) => {
  const response = await api.put(`/links/${shortCode}`, updateData);
  return response.data;
};

export const deleteLink = async (shortCode) => {
  const response = await api.delete(`/links/${shortCode}`);
  return response.data;
};

// ✅ Analytics APIs - Remove /api prefix
export const getAnalytics = async (shortCode) => {
  const response = await api.get(`/analytics/${shortCode}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/analytics/dashboard/stats');
  return response.data;
};

// ✅ Settings APIs - Remove /api prefix
export const getProfile = async () => {
  const response = await api.get('/settings/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/settings/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post('/settings/change-password', passwordData);
  return response.data;
};

export const getSessions = async () => {
  const response = await api.get('/settings/sessions');
  return response.data;
};

export const revokeSession = async (token) => {
  const response = await api.delete(`/settings/sessions/${token}`);
  return response.data;
};

export const revokeAllSessions = async () => {
  const response = await api.post('/settings/sessions/revoke-all');
  return response.data;
};

export const getSubscription = async () => {
  const response = await api.get('/settings/subscription');
  return response.data;
};

export const updateSubscription = async (plan) => {
  const response = await api.put('/settings/subscription', { plan });
  return response.data;
};

export const deleteAccount = async (data) => {
  const response = await api.delete('/settings/account', { data });
  return response.data;
};

export const getComprehensiveAnalytics = async (shortCode, days = null) => {
  const params = days ? { days } : {};
  const response = await api.get(`/analytics/${shortCode}`, { params });
  return response.data.analytics;
};

// ✅ Conversion Tracking APIs
export const getConversionStats = async (shortCode) => {
  const response = await api.get(`/conversions/${shortCode}/stats`);
  return response.data;
};

export const trackConversion = async (shortCode, data) => {
  const response = await api.post(`/conversions/${shortCode}/track`, data);
  return response.data;
};

// ✅ Domain Management APIs  
export const requestDomainVerification = async (shortCode, domain) => {
  const response = await api.post(`/domains/${shortCode}/domain/verify-request`, { domain });
  return response.data;
};

export const checkDomainVerification = async (shortCode) => {
  const response = await api.post(`/domains/${shortCode}/domain/verify-check`);
  return response.data;
};

export const removeDomain = async (shortCode) => {
  const response = await api.delete(`/domains/${shortCode}/domain`);
  return response.data;
};

export const checkSSL = async (shortCode) => {
  const response = await api.get(`/domains/${shortCode}/domain/ssl-status`);
  return response.data;
};

export default api;