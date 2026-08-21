import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAttemptsRequest } from '../services/attemptApi';
import { AttemptWithQuestion } from '../types/attemptTypes';

export default function HistoryScreen() {
  const [attempts, setAttempts] = useState<AttemptWithQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  category: { fontSize: 12, color: '#666', marginBottom: 4 },
  question: { fontSize: 15, fontWeight: '500', marginBottom: 8 },
  score: { fontSize: 14, fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#666' },
});