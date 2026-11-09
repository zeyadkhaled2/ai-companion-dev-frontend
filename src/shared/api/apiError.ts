import axios from 'axios';

export function aiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 429) return 'The AI request limit was reached. Try again later.';
    if (status === 504 || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'The request timed out. Try again when you’re ready.';
    }
    if (!error.response) return 'Could not reach the server. Check your connection and try again.';
  }
  return fallback;
}

export function authErrorMessage(error: unknown, action: 'login' | 'register'): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Cannot reach the server. Check your connection and try again.';
    if (error.response.status === 401) return 'Invalid email or password';
    if (error.response.status === 409) return 'An account with this email already exists';
    if (error.response.status === 429) return 'Too many requests. Please try again in a moment.';
  }
  return action === 'login'
    ? 'Could not log in. Please try again.'
    : 'Could not create your account. Please try again.';
}
