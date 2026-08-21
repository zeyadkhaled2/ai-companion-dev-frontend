// src/components/AppHeader.tsx
import { Text, StyleSheet } from 'react-native';

export default function AppHeader() {
  return <Text style={styles.brand}>Developer Companion</Text>;
}

const styles = StyleSheet.create({
  brand: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
});