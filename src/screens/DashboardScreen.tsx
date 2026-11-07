import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { getStatsRequest } from '../services/attemptApi';
import { useFocusedResource } from '../hooks/useFocusedResource';
import LoadError from '../components/LoadError';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../constants/theme';
import AppHeader from '../components/AppHeader';

const AXIS_WIDTH = 40;
const CHART_PADDING = 32;

export default function DashboardScreen() {
  const { data: stats, isLoading, error, retry } = useFocusedResource(getStatsRequest);
  const [cardWidth, setCardWidth] = useState(0);
  const plotWidth = Math.max(0, cardWidth - CHART_PADDING - AXIS_WIDTH - 16);
  const theme = useTheme();
  const styles = createStyles(theme);

  if (isLoading && !stats) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
  }

  if (error && (!stats || stats.totalAttempts === 0)) {
    return <SafeAreaView style={styles.centered}><LoadError message="Could not load progress. Check your connection." onRetry={retry} /></SafeAreaView>;
  }

  if (!stats || stats.totalAttempts === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.emptyText}>No data yet — answer a few questions to see your progress!</Text>
      </SafeAreaView>
    );
  }

  const trendData = stats.scoreTrend.map((point) => ({ value: point.score }));
  const categoryData = stats.categoryAverages.map((cat) => ({
    value: cat.averageScore,
    label: cat.category,
    frontColor: theme.primary,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={retry} tintColor={theme.primary} />}>
        {error && <LoadError message="Could not refresh progress. Showing the last result." onRetry={retry} />}
        <AppHeader />
        <Text style={styles.title}>Your Progress</Text>

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
        <View style={styles.chartCard} onLayout={event => setCardWidth(event.nativeEvent.layout.width)}>
          {plotWidth > 0 && <LineChart
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
          />}
        </View>

        <Text style={styles.sectionTitle}>By Category</Text>
        <View style={styles.chartCard} onLayout={event => setCardWidth(event.nativeEvent.layout.width)}>
          {plotWidth > 0 && <BarChart
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
          />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { padding: 16, paddingBottom: 140 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background, padding: 32 },
    emptyText: { textAlign: 'center', color: theme.textSecondary, fontSize: 15 },
    title: { fontSize: 26, fontWeight: '700', color: theme.text, marginBottom: 16 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statCard: { flex: 1, backgroundColor: theme.card, borderRadius: 14, padding: 16, alignItems: 'center' },
    statValue: { fontSize: 28, fontWeight: '700', color: theme.primary },
    statLabel: { fontSize: 13, color: theme.textSecondary, marginTop: 4 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 },
    chartCard: { backgroundColor: theme.card, borderRadius: 14, padding: 16, marginBottom: 24, overflow: 'hidden' },
  });
}
