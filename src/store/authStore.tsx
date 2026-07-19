import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { loginRequest, registerRequest } from '../services/authApi';
import { LoginFormData, RegisterFormData } from '../types/authSchemas';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;

}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true,
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  login: async (data) => {
    const result = await loginRequest(data);
    await SecureStore.setItemAsync('userToken', result.token);
    set({ token: result.token });
  },
  register: async (data) => {
    const result = await registerRequest(data);
    await SecureStore.setItemAsync('userToken', result.token);
    set({ token: result.token }); 
  },
  logout: async () => {
    SecureStore.deleteItemAsync("userToken");
    set({token: null});
  }
}));