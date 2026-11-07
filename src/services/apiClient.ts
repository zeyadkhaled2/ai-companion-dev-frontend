import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import * as SecureStore from 'expo-secure-store';

import { API_BASE_URL, API_TIMEOUT_MS } from './apiConfig';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const token = useAuthStore.getState().token;
    if (error.response?.status === 401 && token && error.config?.headers?.Authorization === `Bearer ${token}`) {
      try {
        await SecureStore.deleteItemAsync('userToken');
      } catch {
        // Still end the in-memory session if persistent storage is unavailable.
      }
      if (useAuthStore.getState().token === token) useAuthStore.setState({ token: null });
    }
    return Promise.reject(error);
  }
);
