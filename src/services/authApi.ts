import { LoginFormData, RegisterFormData } from '../types/authSchemas';
import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './apiConfig';

// Auth requests must not depend on the store or clear a session on failed login.
const apiClient = axios.create({ baseURL: API_BASE_URL, timeout: API_TIMEOUT_MS });

export async function loginRequest(data: LoginFormData) {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
}

export async function registerRequest(data: RegisterFormData) {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
}

