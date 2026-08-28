import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../constants/theme';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  History: 'time-outline',
  Dashboard: 'stats-chart-outline',
  Home: 'add',
  Account: 'person-outline',
};

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isCenter = route.name === 'Home';
          const onPress = () => { if (!isFocused) navigation.navigate(route.name); };

          if (isCenter) {
            return (
              <TouchableOpacity key={route.key} onPress={onPress} style={styles.centerButton} activeOpacity={0.85}>
                <Ionicons name={ICONS[route.name]} size={28} color="#FFFFFF" />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem} activeOpacity={0.6}>
              <Ionicons name={ICONS[route.name]} size={24} color={isFocused ? theme.primary : theme.textSecondary} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    wrapper: { position: 'absolute', bottom: 24, left: 20, right: 20, alignItems: 'center' },
    bar: {
      flexDirection: 'row', backgroundColor: theme.card, borderRadius: 32, height: 64, width: '100%',
      alignItems: 'center', justifyContent: 'space-around',
      shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 8,
    },
    tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    centerButton: {
      width: 56, height: 56, borderRadius: 28, backgroundColor: theme.primary,
      alignItems: 'center', justifyContent: 'center', marginTop: -28,
      shadowColor: theme.primary, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6,
    },
  });
}