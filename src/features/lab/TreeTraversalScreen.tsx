import { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../shared/hooks/useTheme';
import { exampleFolder, visitFolders } from './recursionTrace';
import { useLabReduceMotion } from './useLabReduceMotion';

const visits = visitFolders(exampleFolder);

export default function TreeTraversalScreen() {
  const theme = useTheme();
  const reduced = useLabReduceMotion();
  const pulse = useRef(new Animated.Value(1)).current;
  const [visited, setVisited] = useState(0);
  const [hint, setHint] = useState('');
  const current = visits[visited - 1];
  const done = visited === visits.length;

  useEffect(() => {
    if (reduced || visited === 0) {
      pulse.setValue(1);
      return;
    }
    pulse.setValue(0.9);
    const animation = Animated.spring(pulse, {
      toValue: 1,
      useNativeDriver: true,
      stiffness: 250,
      damping: 16,
      mass: 0.7,
    });
    animation.start();
    return () => animation.stop();
  }, [pulse, reduced, visited]);

  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 12, gap: 14 }}>
        <Text style={{ color: theme.textSecondary, fontSize: 12, fontWeight: '700' }}>
          NEXT LAB / DEPTH FIRST
        </Text>
        <Text
          accessibilityRole="header"
          style={{ color: theme.text, fontSize: 28, fontWeight: '700' }}
        >
          Explore the folder tree
        </Text>
        <Text style={{ color: theme.text, fontSize: 15, lineHeight: 22 }}>
          Start at Projects. Visit a folder before its children, and finish the leftmost branch
          before moving to the next.
        </Text>
        <View style={{ backgroundColor: theme.accentSoft, borderRadius: 16, padding: 14, gap: 4 }}>
          <Text style={{ color: theme.text, fontSize: 16, fontWeight: '700' }}>
            {visited} of {visits.length} visited
          </Text>
          <Text
            accessibilityLiveRegion="polite"
            style={{ color: theme.text, fontSize: 14, lineHeight: 20 }}
          >
            {done
              ? 'Tree explored! You went deep into Art before returning to visit Music.'
              : hint ||
                (current
                  ? `You are at ${current.name}. Which folder comes next?`
                  : 'Tap Projects to enter the root.')}
          </Text>
        </View>
        {visits.map((folder, index) => {
          const seen = index < visited;
          const active = index === visited - 1;
          return (
            <Animated.View
              key={folder.path}
              style={{ marginLeft: folder.depth * 18, transform: [{ scale: active ? pulse : 1 }] }}
            >
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={folder.path}
                accessibilityState={{ disabled: seen }}
                disabled={seen}
                onPress={() => {
                  if (index !== visited) {
                    setHint(`Try ${visits[visited].name} first to finish that branch.`);
                    return;
                  }
                  setHint('');
                  setVisited((value) => (value === index ? value + 1 : value));
                }}
                style={[
                  styles.row,
                  {
                    backgroundColor: seen ? theme.accentSoft : theme.card,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name={seen ? 'checkmark-circle' : 'folder-outline'}
                  size={23}
                  color={theme.text}
                />
                <Text style={{ flex: 1, color: theme.text, fontSize: 16, fontWeight: '600' }}>
                  {folder.name}
                </Text>
                {active && (
                  <Text style={{ color: theme.textSecondary, fontSize: 12 }}>You are here</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => {
            setVisited(0);
            setHint('');
          }}
          style={{
            minHeight: 48,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.primary,
          }}
        >
          <Text style={{ color: theme.onPrimary, fontWeight: '700' }}>
            {done ? 'Play again' : 'Reset traversal'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
});
