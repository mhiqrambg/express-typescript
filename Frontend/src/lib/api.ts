"use client";

import axios from 'axios';
import { clientStorage } from './client-utils';

const baseURL = 'http://localhost:3000'; // Backend API URL

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token to headers
api.interceptors.request.use(
  (config) => {
    const token = clientStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/v1/login', { email, password });
    if (response.data.token) {
      clientStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: async (name: string, email: string, password: string, re_password: string) => {
    const response = await api.post('/api/v1/register', { name, email, password, re_password });
    return response.data;
  },
  logout: () => {
    clientStorage.removeItem('token');
  },
};

// User services
export const userService = {
  getAll: async () => {
    const response = await api.get('/api/v1/users');
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/api/v1/users/${id}`);
    return response.data;
  },
  create: async (user: { name: string; email: string; password: string; re_password?: string }) => {
    // Ensure re_password is included for validation
    if (!user.re_password && user.password) {
      user.re_password = user.password;
    }
    
    const token = clientStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await api.post('/api/v1/users', user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  update: async (id: string, user: { name: string; email: string; password?: string; re_password?: string }) => {
    // If password is provided, ensure re_password is included
    if (user.password && !user.re_password) {
      user.re_password = user.password;
    }
    
    const token = clientStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await api.put(`/api/v1/users/${id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
  delete: async (id: string) => {
    const token = clientStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await api.delete(`/api/v1/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },
};

export default api; 