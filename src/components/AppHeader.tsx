import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function AppHeader() {
  const theme = useTheme();
  return <Text style={[styles.brand, { color: theme.textSecondary }]}>Developer Companion</Text>;
}

const styles = StyleSheet.create({
  brand: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
});