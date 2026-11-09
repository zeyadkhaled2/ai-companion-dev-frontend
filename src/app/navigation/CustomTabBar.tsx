import Avatar from '../../shared/components/Avatar';
import { useAuthStore } from '../../features/auth/store/authStore';
import { useState, useEffect, useRef, ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
  Animated,
  AccessibilityInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../shared/hooks/useTheme';
import { Theme } from '../../shared/theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  History: 'time-outline',
  Dashboard: 'stats-chart-outline',
  Home: 'home-outline',
  Chat: 'chatbubble-ellipses-outline',
  Account: 'person-outline',
};
const LABELS: Record<string, string> = { Dashboard: 'Progress', Chat: 'Mentor' };

function TabIndicator({
  selected,
  reduceMotion,
  children,
  theme,
}: {
  selected: boolean;
  reduceMotion: boolean;
  children: ReactNode;
  theme: Theme;
}) {
  const progress = useRef(new Animated.Value(selected ? 1 : 0)).current;
  useEffect(() => {
    progress.stopAnimation();
    if (reduceMotion) {
      progress.setValue(selected ? 1 : 0);
      return;
    }
    const animation = Animated.spring(progress, {
      toValue: selected ? 1 : 0,
      stiffness: 260,
      damping: 24,
      mass: 0.7,
      useNativeDriver: true,
      isInteraction: false,
      overshootClamping: true,
    });
    animation.start();
    return () => animation.stop();
  }, [selected, reduceMotion, progress]);
  return (
    <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: theme.accentSoft,
          opacity: progress,
          transform: [
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] }) },
          ],
        }}
      />
      <Animated.View
        style={{
          transform: [
            { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.13] }) },
          ],
        }}
      >
        {children}
      </Animated.View>
    </View>
  );
}

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const user = useAuthStore((state) => state.user);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  // Start without motion until the system preference is known.
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduceMotion(value);
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  if (keyboardVisible) return null;
  return (
    <View style={[styles.wrapper, { bottom: Math.max(24, insets.bottom + 8) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const selected = state.index === index;
          const label = LABELS[route.name] || route.name;
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected }}
              activeOpacity={0.75}
              style={styles.tabItem}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!selected && !event.defaultPrevented) navigation.navigate(route.name);
              }}
            >
              <TabIndicator selected={selected} reduceMotion={reduceMotion} theme={theme}>
                {route.name === 'Account' ? (
                  <Avatar photo={user?.photo} name={user?.name} size={24} />
                ) : (
                  <Ionicons
                    name={ICONS[route.name]}
                    size={23}
                    color={selected ? theme.text : theme.textSecondary}
                  />
                )}
              </TabIndicator>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: selected ? '700' : '500',
                  color: selected ? theme.text : theme.textSecondary,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
function createStyles(theme: Theme) {
  return StyleSheet.create({
    wrapper: { position: 'absolute', left: 20, right: 20, alignItems: 'center' },
    bar: {
      flexDirection: 'row',
      backgroundColor: theme.card,
      borderRadius: 24,
      minHeight: 76,
      padding: 6,
      borderWidth: 1,
      borderColor: theme.border,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-around',
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
    },
    tabItem: { flex: 1, minHeight: 60, alignItems: 'center', justifyContent: 'center' },
  });
}
