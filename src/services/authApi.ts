import axios from 'axios';
import { LoginFormData } from '../types/authSchemas';

const API_URL = 'http://10.0.2.2:3000/api/auth';

export async function loginRequest(data: LoginFormData) {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data; // { token, user }
}