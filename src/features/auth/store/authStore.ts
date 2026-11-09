import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import {
  loginRequest,
  registerRequest,
  profileRequest,
  photoRequest,
  UserProfile,
} from '../api/authApi';
import { LoginFormData, RegisterFormData } from '../types/authSchemas';
export const GREETINGS = [
  'champ',
  'ace',
  'builder',
  'trailblazer',
  'star',
  'legend',
  'go-getter',
] as const;
export function pickGreeting(previous: string | null, random = Math.random): string {
  const choices = GREETINGS.filter((word) => word !== previous);
  return choices[Math.floor(random() * choices.length)]!;
}
async function newGreeting(): Promise<string> {
  // Cosmetic storage must never prevent a successful sign-in.
  const previous = await SecureStore.getItemAsync('sessionGreeting').catch(() => null);
  const greeting = pickGreeting(previous);
  await SecureStore.setItemAsync('sessionGreeting', greeting).catch(() => {});
  return greeting;
}
interface AuthState {
  greeting: string;
  setGreeting: (greeting: string | null) => void;
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  refreshProfile: () => Promise<void>;
  updatePhoto: (photo: string | null) => Promise<void>;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set, get) => ({
  greeting: 'champ',
  setGreeting: (greeting) =>
    set({
      greeting: GREETINGS.includes(greeting as (typeof GREETINGS)[number]) ? greeting! : 'champ',
    }),
  user: null,
  token: null,
  isLoading: true,
  setToken: (token) => set({ token, user: null }),
  setLoading: (isLoading) => set({ isLoading }),
  refreshProfile: async () => {
    const token = get().token;
    const previous = get().user;
    if (!token) return;
    const user = await profileRequest(token);
    if (get().token === token && get().user === previous) set({ user });
  },
  updatePhoto: async (photo) => {
    const token = get().token;
    if (!token) throw new Error('Please sign in again');
    const user = await photoRequest(token, photo);
    if (get().token === token) set({ user });
  },
  login: async (data) => {
    const result = await loginRequest(data);
    await SecureStore.setItemAsync('userToken', result.token);
    const greeting = await newGreeting();
    set({ token: result.token, user: result.user, greeting });
  },
  register: async (data) => {
    const result = await registerRequest(data);
    await SecureStore.setItemAsync('userToken', result.token);
    const greeting = await newGreeting();
    set({ token: result.token, user: result.user, greeting });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
    set({ token: null, user: null });
  },
}));
