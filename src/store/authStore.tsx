import { create} from 'zustand';

interface AuthState {
    token: string | null;
    isLoading: boolean;
    setToken: (token: string | null) => void;
    setLoading: (isLoading: boolean) => void;
  }
  
  export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    isLoading: true,
    setToken: (token) => set({ token }),
    setLoading: (isLoading) => set({ isLoading }),
  }));