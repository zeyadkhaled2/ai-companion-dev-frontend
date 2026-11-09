import { useCallback } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import LoadError from '../../../shared/components/LoadError';
import { useFocusedResource } from '../../../shared/hooks/useFocusedResource';
import { useTheme } from '../../../shared/hooks/useTheme';
import { loadOutputProgress } from '../../output/data/progress';

export default function OutputProgressCard({ userId }: { userId: string }) {
  const theme = useTheme();
  const load = useCallback(() => loadOutputProgress(userId), [userId]);
  const { data, isLoading, error, retry } = useFocusedResource(load);

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border,
        padding: 16,
        marginBottom: 24,
        gap: 8,
      }}
    >
      <Text
        accessibilityRole="header"
        style={{ color: theme.text, fontSize: 17, fontWeight: '700' }}
      >
        JavaScript challenges
      </Text>
      {data && (
        <>
          <Text style={{ color: theme.text, fontSize: 24, fontWeight: '700' }}>
            {data.solved} of {data.total} solved
          </Text>
          <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
            {data.attempted > 0
              ? `${data.attempted} attempted. Based on your latest answers on this device.`
              : 'Try Predict the output to start tracking your progress.'}
          </Text>
        </>
      )}
      {isLoading && !data && <ActivityIndicator color={theme.primary} />}
      {error && (
        <LoadError message="Could not read your saved JavaScript results." onRetry={retry} />
      )}
    </View>
  );
}
