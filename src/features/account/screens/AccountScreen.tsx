import PhotoPicker from '../../../shared/components/PhotoPicker';
import { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../auth/store/authStore';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Theme } from '../../../shared/theme/theme';
import { useState } from 'react';

export default function AccountScreen() {
  const user = useAuthStore((state) => state.user);
  const updatePhoto = useAuthStore((state) => state.updatePhoto);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const [profileError, setProfileError] = useState(false);
  const loadProfile = () => {
    setProfileError(false);
    refreshProfile().catch(() => setProfileError(true));
  };
  useEffect(loadProfile, [refreshProfile]);
  const logout = useAuthStore((state) => state.logout);
  const theme = useTheme();
  const styles = createStyles(theme);
  const [logoutError, setLogoutError] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    setLogoutError(false);
    try {
      await logout();
    } catch {
      setLogoutError(true);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 140 }]}>
        <Text style={styles.title}>Your space</Text>
        {profileError && (
          <TouchableOpacity onPress={loadProfile}>
            <Text style={{ color: theme.danger, padding: 16 }}>
              Could not load your profile. Tap to retry.
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{ backgroundColor: theme.card, padding: 24, borderRadius: 24, marginBottom: 24 }}
        >
          <PhotoPicker
            photo={user?.photo}
            name={user?.name}
            onChange={updatePhoto}
            disabled={!user || isLoggingOut}
          />
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '700', textAlign: 'center' }}>
            {user?.name || 'Your profile'}
          </Text>
          <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 8 }}>
            {user?.email}
          </Text>
        </View>
        {logoutError && (
          <Text accessibilityRole="alert" style={{ color: theme.danger }}>
            Could not clear the saved session. Please try again.
          </Text>
        )}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { flexGrow: 1, padding: 20 },
    title: { fontSize: 26, fontWeight: '700', color: theme.text, marginBottom: 24 },
    logoutButton: {
      backgroundColor: theme.card,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
    },
    logoutText: { fontSize: 16, color: theme.danger, fontWeight: '600' },
  });
}
