import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import AppHeader from '../components/AppHeader';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../constants/theme';
import { useState } from 'react';

export default function AccountScreen() {
  const logout = useAuthStore((state) => state.logout);
  const theme = useTheme();
  const styles = createStyles(theme);
  const [logoutError, setLogoutError] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError(false);
    try { await logout(); } catch { setLogoutError(true); } finally { setLoggingOut(false); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <AppHeader />
        <Text style={styles.title}>Account</Text>
        {logoutError && <Text accessibilityRole="alert" style={{ color: theme.danger }}>Could not clear the saved session. Please try again.</Text>}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoggingOut} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { flex: 1, padding: 20 },
    title: { fontSize: 26, fontWeight: '700', color: theme.text, marginBottom: 24 },
    logoutButton: { backgroundColor: theme.card, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
    logoutText: { fontSize: 16, color: theme.danger, fontWeight: '600' },
  });
}
