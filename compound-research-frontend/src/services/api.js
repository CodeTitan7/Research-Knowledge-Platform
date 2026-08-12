import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT Token to every outgoing request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if unauthenticated
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// Authentication Service
export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success && res.data) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res;
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Dashboard Service
export const dashboardService = {
  getStats: async () => {
    return await api.get('/dashboard/stats');
  },
};

// Compounds Service
export const compoundService = {
  getAll: async (params = {}) => {
    return await api.get('/compounds', { params });
  },

  getById: async (id) => {
    return await api.get(`/compounds/${id}`);
  },

  create: async (data) => {
    return await api.post('/compounds', data);
  },

  update: async (id, data) => {
    return await api.put(`/compounds/${id}`, data);
  },

  delete: async (id) => {
    return await api.delete(`/compounds/${id}`);
  },

  review: async (id, reviewData) => {
    return await api.post(`/compounds/${id}/review`, reviewData);
  },
};

// Targets & Categories Service
export const targetService = {
  getAll: async () => {
    return await api.get('/targets');
  },
  create: async (targetData) => {
    return await api.post('/targets', targetData);
  },
};

export const categoryService = {
  getAll: async () => {
    return await api.get('/categories');
  },
  create: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },
};

// Documents Service
export const documentService = {
  getAll: async () => {
    return await api.get('/documents');
  },

  getById: async (id) => {
    return await api.get(`/documents/${id}`);
  },

  upload: async (file, title, relatedCompoundId) => {
    const formData = new FormData();
    formData.append('File', file);
    if (title) formData.append('Title', title);
    if (relatedCompoundId) formData.append('RelatedCompoundId', relatedCompoundId);

    return await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  delete: async (id) => {
    return await api.delete(`/documents/${id}`);
  },
};

// Research & AI Agent Service
export const researchService = {
  ask: async (question, compoundId = null) => {
    const payload = { question };
    if (compoundId) payload.compoundId = Number(compoundId);
    return await api.post('/query/ask', payload);
  },

  getHistory: async () => {
    return await api.get('/query/history');
  },
};

// User Management Service (Admin only)
export const userService = {
  getAll: async () => {
    return await api.get('/users');
  },

  create: async (userData) => {
    return await api.post('/users', userData);
  },

  changeRole: async (id, newRole) => {
    return await api.put(`/users/${id}/role`, JSON.stringify(newRole), {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  setActive: async (id, isActive) => {
    return await api.put(`/users/${id}/active`, isActive, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

export default api;
