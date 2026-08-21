import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Types';

type HomeNavProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;

export default function HomeScreen() {
  const logout = useAuthStore((state) => state.logout);
  const navigation = useNavigation<HomeNavProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.eyebrow}>Welcome back</Text>
          <Text style={styles.title}>Ready to practice?</Text>
        </View>

        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => navigation.navigate('History')}
          activeOpacity={0.6}
        >
          <Text style={styles.historyIcon}>🕓</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.centerArea}>
        <TouchableOpacity
          style={styles.heroCard}
          onPress={() => navigation.navigate('QuestionSetup')}
          activeOpacity={0.85}
        >
          <Text style={styles.heroIcon}>✦</Text>
          <Text style={styles.heroTitle}>New Question</Text>
          <Text style={styles.heroSubtitle}>Start an AI-generated interview question</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()} activeOpacity={0.6}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  eyebrow: { fontSize: 15, color: '#8E8E93', marginBottom: 2 },
  title: { fontSize: 26, fontWeight: '700', color: '#000', letterSpacing: 0.3 },
  historyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  historyIcon: { fontSize: 18 },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  heroIcon: { fontSize: 30, color: '#FFD60A', marginBottom: 14 },
  heroTitle: { fontSize: 23, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  heroSubtitle: { fontSize: 14, color: '#AEAEB2', textAlign: 'center' },
  logoutButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: { fontSize: 15, color: '#FF3B30', fontWeight: '500' },
});