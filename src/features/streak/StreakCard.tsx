import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../shared/hooks/useTheme';
import { useStreak } from './StreakProvider';

export default function StreakCard({ personalBest = false }: { personalBest?: boolean }) {
  const { streak, error, retry } = useStreak();
  const theme = useTheme();
  const dayLabel = streak?.current === 1 ? 'day' : 'days';
  const bestLabel = streak?.best === 1 ? 'day' : 'days';

  return (
    <View
      style={{
        padding: 16,
        marginBottom: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.card,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View style={{ borderRadius: 14, padding: 10, backgroundColor: theme.accentSoft }}>
        <Ionicons name="flame" size={22} color={theme.text} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
          {personalBest
            ? 'Highest login streak'
            : streak
              ? `${streak.current} ${dayLabel} in a row`
              : 'Login streak'}
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
          {personalBest && streak
            ? `${streak.best} ${bestLabel} in a row`
            : error
              ? 'Could not load your streak.'
              : streak
                ? `Best: ${streak.best} ${bestLabel} · Days use UTC`
                : 'Checking in…'}
        </Text>
      </View>
      {error && (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={retry}
          style={{ paddingVertical: 12 }}
        >
          <Text style={{ color: theme.text, fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
