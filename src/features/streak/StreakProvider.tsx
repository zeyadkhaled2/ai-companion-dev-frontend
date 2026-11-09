import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { apiClient } from '../../shared/api/apiClient';

type Streak = { current: number; best: number };
const StreakContext = createContext<{
  streak: Streak | null;
  error: boolean;
  retry: () => void;
}>({ streak: null, error: false, retry: () => {} });

export function StreakProvider({ children }: { children: ReactNode }) {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [error, setError] = useState(false);
  const inFlight = useRef<AbortController | null>(null);

  const checkIn = useCallback(async () => {
    if (inFlight.current) return;
    const controller = new AbortController();
    inFlight.current = controller;
    setError(false);
    try {
      const response = await apiClient.post<Streak>('/streak/check-in', undefined, {
        signal: controller.signal,
        timeout: 10000,
      });
      if (!controller.signal.aborted) setStreak(response.data);
    } catch {
      if (!controller.signal.aborted) setError(true);
    } finally {
      if (inFlight.current === controller) inFlight.current = null;
    }
  }, []);

  useEffect(() => {
    void checkIn();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void checkIn();
    });
    return () => {
      subscription.remove();
      inFlight.current?.abort();
      inFlight.current = null;
    };
  }, [checkIn]);

  return (
    <StreakContext.Provider value={{ streak, error, retry: checkIn }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  return useContext(StreakContext);
}
