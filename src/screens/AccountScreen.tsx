import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import AppHeader from '../components/AppHeader';

export default function AccountScreen() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppHeader />
        <Text style={styles.title}>Account</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={() => logout()} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 24 },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
});