import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAttemptsRequest } from '../../practice/api/attemptApi';
import { useFocusedResource } from '../../../shared/hooks/useFocusedResource';
import LoadError from '../../../shared/components/LoadError';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Theme } from '../../../shared/theme/theme';

export default function HistoryScreen() {
  const { data, isLoading, error, retry } = useFocusedResource(getAttemptsRequest);
  const attempts = data?.attempts ?? [];
  const theme = useTheme();
  const styles = createStyles(theme);

  if (isLoading && !data) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>History</Text>
      {error && (
        <LoadError message="Could not load history. Check your connection." onRetry={retry} />
      )}
      <FlatList
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshing={isLoading}
        onRefresh={retry}
        data={attempts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.category}>
              {item.question.category} · {item.question.difficulty}
            </Text>
            <Text style={styles.question} numberOfLines={2}>
              {item.question.content}
            </Text>
            <Text style={styles.score}>Score: {item.aiScore}/100</Text>
          </View>
        )}
        ListEmptyComponent={
          !error ? (
            <Text style={styles.emptyText}>No attempts yet — go answer a question!</Text>
          ) : undefined
        }
      />
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: theme.background },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    title: { fontSize: 26, fontWeight: '700', color: theme.text, marginBottom: 16 },
    card: {
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 12,
      marginBottom: 12,
    },
    category: { fontSize: 12, color: theme.textSecondary, marginBottom: 4 },
    question: { fontSize: 15, fontWeight: '500', marginBottom: 8, color: theme.text },
    score: { fontSize: 14, fontWeight: '600', color: theme.text },
    emptyText: { textAlign: 'center', marginTop: 40, color: theme.textSecondary },
  });
}
