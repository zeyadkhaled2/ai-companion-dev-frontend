import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

// Refresh existing tabs when they become visible, ignoring obsolete responses.
export function useFocusedResource<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T>();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      setError(false);
      load()
        .then((result) => {
          if (active) setData(result);
        })
        .catch(() => {
          if (active) setError(true);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [load, revision]),
  );
  return { data, isLoading, error, retry: () => setRevision((value) => value + 1) };
}
