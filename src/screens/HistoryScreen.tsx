import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAttemptsRequest } from '../services/attemptApi';
import { AttemptWithQuestion } from '../types/attemptTypes';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../constants/theme';
import AppHeader from '../components/AppHeader';

export default function HistoryScreen() {
  const [attempts, setAttempts] = useState<AttemptWithQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    async function loadAttempts() {
      try {
        const result = await getAttemptsRequest();
        setAttempts(result.attempts);
      } catch (err) {
        console.log('Failed to load history', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAttempts();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <Text style={styles.title}>History</Text>
      <FlatList
        data={attempts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.category}>{item.question.category} · {item.question.difficulty}</Text>
            <Text style={styles.question} numberOfLines={2}>{item.question.content}</Text>
            <Text style={styles.score}>Score: {item.aiScore}/100</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No attempts yet — go answer a question!</Text>}
      />
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: theme.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background },
    title: { fontSize: 26, fontWeight: '700', color: theme.text, marginBottom: 16 },
    card: { borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 8, padding: 12, marginBottom: 12 },
    category: { fontSize: 12, color: theme.textSecondary, marginBottom: 4 },
    question: { fontSize: 15, fontWeight: '500', marginBottom: 8, color: theme.text },
    score: { fontSize: 14, fontWeight: '600', color: theme.text },
    emptyText: { textAlign: 'center', marginTop: 40, color: theme.textSecondary },
  });
}