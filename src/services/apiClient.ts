import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://192.168.1.12:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});