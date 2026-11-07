import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import LoadError from '../components/LoadError';
import { useTheme } from '../hooks/useTheme';
import * as SecureStore from 'expo-secure-store';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuthStore } from '../store/authStore';

export default function RootNavigator() {
  const { token, isLoading, setToken, setLoading } = useAuthStore();
  const [startupError, setStartupError] = useState(false);
  const [retry, setRetry] = useState(0);
  const theme = useTheme();
  const scheme = useColorScheme();

  useEffect(() => {
    let active = true;
    async function loadToken() {
      setLoading(true);
      setStartupError(false);
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (active) setToken(storedToken);
      } catch {
        if (active) setStartupError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadToken();
    return () => { active = false; };
  }, [retry, setToken, setLoading]);

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.background }}><ActivityIndicator color={theme.primary} /></View>;
  }
  if (startupError) return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.background }}><LoadError message="Could not read your saved session." onRetry={() => setRetry(value => value + 1)} /></View>;

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
