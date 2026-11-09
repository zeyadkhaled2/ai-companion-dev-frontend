import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { getStatsRequest } from '../../practice/api/attemptApi';
import { useFocusedResource } from '../../../shared/hooks/useFocusedResource';
import LoadError from '../../../shared/components/LoadError';
import StreakCard from '../../streak/StreakCard';
import { useAuthStore } from '../../auth/store/authStore';
import OutputProgressCard from '../components/OutputProgressCard';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Theme } from '../../../shared/theme/theme';

const AXIS_WIDTH = 40;
const CHART_PADDING = 32;

export default function DashboardScreen() {
  const userId = useAuthStore((state) => state.user?.id);
  const { data: stats, isLoading, error, retry } = useFocusedResource(getStatsRequest);
  const [cardWidth, setCardWidth] = useState(0);
  const plotWidth = Math.max(0, cardWidth - CHART_PADDING - AXIS_WIDTH - 16);
  const theme = useTheme();
  const styles = createStyles(theme);

  const trendData = (stats?.scoreTrend ?? []).map((point) => ({ value: point.score }));
  const categoryData = (stats?.categoryAverages ?? []).map((cat) => ({
    value: cat.averageScore,
    label: cat.category,
    frontColor: theme.primary,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={retry} tintColor={theme.primary} />
        }
      >
        <Text style={styles.title}>Your Progress</Text>
        <StreakCard personalBest />
        {userId && <OutputProgressCard key={userId} userId={userId} />}
        <Text style={styles.sectionTitle}>Interview practice</Text>
        {error && (
          <LoadError
            message={
              stats?.totalAttempts
                ? 'Could not refresh practice stats. Showing the last result.'
                : 'Could not load practice stats. Check your connection.'
            }
            onRetry={retry}
          />
        )}
        {isLoading && !stats && <ActivityIndicator color={theme.primary} />}
        {!isLoading && !error && !stats?.totalAttempts && (
          <Text style={styles.emptyText}>
            Answer a few interview questions to see your practice stats.
          </Text>
        )}
        {!!stats?.totalAttempts && (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalAttempts}</Text>
                <Text style={styles.statLabel}>Attempts</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.averageScore}</Text>
                <Text style={styles.statLabel}>Avg Score</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Score Trend</Text>
            <View
              style={styles.chartCard}
              onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
            >
              {plotWidth > 0 && (
                <LineChart
                  data={trendData}
                  width={plotWidth}
                  yAxisLabelWidth={AXIS_WIDTH}
                  endSpacing={0}
                  rulesLength={plotWidth}
                  rulesColor={theme.border}
                  xAxisColor={theme.border}
                  yAxisColor={theme.border}
                  color={theme.primary}
                  thickness={3}
                  hideDataPoints={false}
                  dataPointsColor={theme.primary}
                  yAxisTextStyle={{ color: theme.textSecondary }}
                  xAxisLabelTextStyle={{ color: theme.textSecondary }}
                  noOfSections={4}
                  maxValue={100}
                />
              )}
            </View>

            <Text style={styles.sectionTitle}>By Category</Text>
            <View
              style={styles.chartCard}
              onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
            >
              {plotWidth > 0 && (
                <BarChart
                  data={categoryData}
                  width={plotWidth}
                  yAxisLabelWidth={AXIS_WIDTH}
                  endSpacing={0}
                  rulesLength={plotWidth}
                  rulesColor={theme.border}
                  xAxisColor={theme.border}
                  yAxisColor={theme.border}
                  barWidth={28}
                  spacing={20}
                  roundedTop
                  yAxisTextStyle={{ color: theme.textSecondary }}
                  xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 11 }}
                  noOfSections={4}
                  maxValue={100}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { padding: 16, paddingBottom: 140 },
    emptyText: { textAlign: 'center', color: theme.textSecondary, fontSize: 15 },
    title: { fontSize: 26, fontWeight: '700', color: theme.text, marginBottom: 16 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 16,
      alignItems: 'center',
    },
    statValue: { fontSize: 28, fontWeight: '700', color: theme.primary },
    statLabel: { fontSize: 13, color: theme.textSecondary, marginTop: 4 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 },
    chartCard: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 16,
      marginBottom: 24,
      overflow: 'hidden',
    },
  });
}
