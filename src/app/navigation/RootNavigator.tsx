import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import LoadError from '../../shared/components/LoadError';
import { useTheme } from '../../shared/hooks/useTheme';
import * as SecureStore from 'expo-secure-store';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuthStore } from '../../features/auth/store/authStore';
import { StreakProvider } from '../../features/streak/StreakProvider';

export default function RootNavigator() {
  const { token, isLoading, setToken, setLoading, setGreeting } = useAuthStore();
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
        const [storedToken, greeting] = await Promise.all([
          SecureStore.getItemAsync('userToken'),
          SecureStore.getItemAsync('sessionGreeting').catch(() => null),
        ]);
        if (active) {
          setGreeting(greeting);
          setToken(storedToken);
        }
      } catch {
        if (active) setStartupError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadToken();
    return () => {
      active = false;
    };
  }, [retry, setToken, setLoading, setGreeting]);

  useEffect(() => {
    if (token)
      useAuthStore
        .getState()
        .refreshProfile()
        .catch(() => {});
  }, [token]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }
  if (startupError)
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.background }}>
        <LoadError
          message="Could not read your saved session."
          onRetry={() => setRetry((value) => value + 1)}
        />
      </View>
    );

  return (
    <NavigationContainer
      theme={{
        ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
        colors: {
          ...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
          background: theme.background,
          card: theme.card,
          text: theme.text,
          primary: theme.primary,
          border: theme.border,
        },
      }}
    >
      {token ? (
        <StreakProvider key={token}>
          <AppStack />
        </StreakProvider>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
