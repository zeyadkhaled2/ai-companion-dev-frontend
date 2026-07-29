import { LoginFormData, RegisterFormData } from '../types/authSchemas';
import { apiClient } from './apiClient';

export async function loginRequest(data: LoginFormData) {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
}

export async function registerRequest(data: RegisterFormData) {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
}

