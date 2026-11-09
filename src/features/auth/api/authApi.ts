import { LoginFormData, RegisterFormData } from '../types/authSchemas';
import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '../../../shared/api/apiConfig';

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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo: string | null;
}
export async function profileRequest(token: string): Promise<UserProfile> {
  return (await apiClient.get('/auth/profile', { headers: { Authorization: `Bearer ${token}` } }))
    .data.user;
}
export async function photoRequest(token: string, photo: string | null): Promise<UserProfile> {
  return (
    await apiClient.patch(
      '/auth/profile/photo',
      { photo },
      { headers: { Authorization: `Bearer ${token}` } },
    )
  ).data.user;
}
