import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuthStore } from '../store/authStore';

export default function RootNavigator() {
  const { token, isLoading, setToken, setLoading } = useAuthStore();

  useEffect(() => {
    async function loadToken() {
      const storedToken = await SecureStore.getItemAsync('userToken');
      setToken(storedToken);
      setLoading(false);
    }
    loadToken();
  }, []);

  if (isLoading) {
    return null; // TODO: replace with a splash/loading screen later
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}