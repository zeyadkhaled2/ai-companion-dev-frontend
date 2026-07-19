import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';

export default function HomeScreen() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={() => logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}