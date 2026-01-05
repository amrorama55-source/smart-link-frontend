import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
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

// Auth APIs
export const register = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const regenerateApiKey = async () => {
  const response = await api.post('/api/auth/regenerate-key');
  return response.data;
};

// Links APIs
export const createLink = async (linkData) => {
  const response = await api.post('/api/links', linkData);
  return response.data;
};

export const getLinks = async (page = 1, limit = 10, search = '', tag = '') => {
  const response = await api.get('/api/links', {
    params: { page, limit, search, tag }
  });
  return response.data;
};

export const getLink = async (shortCode) => {
  const response = await api.get(`/api/links/${shortCode}`);
  return response.data;
};

export const updateLink = async (shortCode, updateData) => {
  const response = await api.put(`/api/links/${shortCode}`, updateData);
  return response.data;
};

export const deleteLink = async (shortCode) => {
  const response = await api.delete(`/api/links/${shortCode}`);
  return response.data;
};

// Analytics APIs
export const getAnalytics = async (shortCode) => {
  const response = await api.get(`/api/analytics/${shortCode}`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/api/analytics/dashboard/stats');
  return response.data;
};

// Settings APIs
export const getProfile = async () => {
  const response = await api.get('/api/settings/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/api/settings/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.post('/api/settings/change-password', passwordData);
  return response.data;
};

export const getSessions = async () => {
  const response = await api.get('/api/settings/sessions');
  return response.data;
};

export const revokeSession = async (token) => {
  const response = await api.delete(`/api/settings/sessions/${token}`);
  return response.data;
};

export const revokeAllSessions = async () => {
  const response = await api.post('/api/settings/sessions/revoke-all');
  return response.data;
};

export const getSubscription = async () => {
  const response = await api.get('/api/settings/subscription');
  return response.data;
};

export const updateSubscription = async (plan) => {
  const response = await api.put('/api/settings/subscription', { plan });
  return response.data;
};

export const deleteAccount = async (data) => {
  const response = await api.delete('/api/settings/account', { data });
  return response.data;
};

// Comprehensive Analytics
export const getComprehensiveAnalytics = async (shortCode, days = null) => {
  const params = days ? { days } : {};
  const response = await api.get(`/api/analytics/${shortCode}`, { params });
  return response.data.analytics;
};


export default api;