import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

export default api;