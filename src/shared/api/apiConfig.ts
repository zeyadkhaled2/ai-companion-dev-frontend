import { Platform } from 'react-native';

// Android emulator reaches the host via 10.0.2.2. Physical devices need a LAN URL.
const localHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${localHost}:3000/api`;
export const API_TIMEOUT_MS = 60000;
