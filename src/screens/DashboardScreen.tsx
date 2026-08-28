import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { getStatsRequest } from '../services/attemptApi';
import { Stats } from '../types/statsTypes';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../constants/theme';
import AppHeader from '../components/AppHeader';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const styles = createStyles(theme);

  useEffect(() => {
    async function loadStats() {
      try {
        const result = await getStatsRequest();
        setStats(result);
      } catch (err) {
        console.log('Failed to load stats', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.primary} />
      </SafeAreaView>
    );
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
      <ScrollView contentContainerStyle={styles.container}>
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
        <View style={styles.chartCard}>
          <LineChart
            data={trendData}
            width={screenWidth - 80}
            color={theme.primary}
            thickness={3}
            hideDataPoints={false}
            dataPointsColor={theme.primary}
            yAxisTextStyle={{ color: theme.textSecondary }}
            xAxisLabelTextStyle={{ color: theme.textSecondary }}
            noOfSections={4}
            maxValue={100}
          />
        </View>

        <Text style={styles.sectionTitle}>By Category</Text>
        <View style={styles.chartCard}>
          <BarChart
            data={categoryData}
            width={screenWidth - 80}
            barWidth={28}
            spacing={20}
            roundedTop
            yAxisTextStyle={{ color: theme.textSecondary }}
            xAxisLabelTextStyle={{ color: theme.textSecondary, fontSize: 11 }}
            noOfSections={4}
            maxValue={100}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    container: { padding: 16, paddingBottom: 100 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background, padding: 32 },
    emptyText: { textAlign: 'center', color: theme.textSecondary, fontSize: 15 },
    title: { fontSize: 26, fontWeight: '700', color: theme.text, marginBottom: 16 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statCard: { flex: 1, backgroundColor: theme.card, borderRadius: 14, padding: 16, alignItems: 'center' },
    statValue: { fontSize: 28, fontWeight: '700', color: theme.primary },
    statLabel: { fontSize: 13, color: theme.textSecondary, marginTop: 4 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 },
    chartCard: { backgroundColor: theme.card, borderRadius: 14, padding: 16, marginBottom: 24, alignItems: 'center' },
  });
}