import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../shared/hooks/useTheme';
import { Theme } from '../../shared/theme/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../app/navigation/types';
import {
  factorialCode,
  FactorialInput,
  inputs,
  traceFactorial,
  sumCode,
  traceSum,
  foldersCode,
  traceFolders,
} from './recursionTrace';
import { useLabReduceMotion } from './useLabReduceMotion';
import RecursionIllustration from './RecursionIllustration';

const examples = [
  {
    title: 'Factorial',
    illustration: 'factorial' as const,
    story:
      'Three factorial is 3 × 2 × 1. Each call waits for a smaller one. Zero factorial is defined as 1.',
    code: factorialCode,
    trace: traceFactorial,
    takeaway:
      'The stack remembered each number. Next, use the same pattern to add coins in a list.',
  },
  {
    title: 'Sum a list',
    illustration: 'sum' as const,
    story:
      'Three jars hold 2, 4, and 3 coins. Keep the first count, then ask a smaller call to add what is left.',
    code: sumCode,
    trace: () => traceSum(),
    takeaway: 'Each call made one smaller call. Next, a folder can send you down several branches.',
  },
  {
    title: 'Count files',
    illustration: 'folders' as const,
    story:
      'Projects has Art and Music folders. Art has a Sketches folder. Count every file by going inside one folder at a time.',
    code: foldersCode,
    trace: () => traceFolders(),
    takeaway:
      'You finished Art and its subfolders before opening Music. That order is depth-first traversal. Try walking the same tree yourself.',
  },
];

export default function RecursionLessonScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const reduceMotion = useLabReduceMotion();
  const transition = useRef(new Animated.Value(1)).current;
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [example, setExample] = useState(0);
  const [input, setInput] = useState<FactorialInput>(3);
  const [index, setIndex] = useState(0);
  const lesson = examples[example];
  const steps = useMemo(() => lesson.trace(input), [lesson, input]);
  const step = steps[index];
  const done = index === steps.length - 1;

  useEffect(() => {
    if (reduceMotion) {
      transition.setValue(1);
      return;
    }
    transition.setValue(0);
    const animation = Animated.timing(transition, {
      toValue: 1,
      duration: 210,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [example, index, input, reduceMotion, transition]);

  function changeStep(next: number) {
    if (!reduceMotion) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIndex(next);
  }

  function chooseExample(next: number) {
    if (!reduceMotion && next !== example)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIndex(0);
    setExample(next);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }

  function advance() {
    if (!done) {
      changeStep(index + 1);
      return;
    }
    if (example + 1 < examples.length) {
      chooseExample(example + 1);
      return;
    }
    navigation.navigate('TreeTraversal');
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
      <ScrollView ref={scroll} contentContainerStyle={styles.content}>
        <RecursionIllustration kind={lesson.illustration} />
        <Text style={styles.label}>
          RECURSION / EXAMPLE {example + 1} OF {examples.length}
        </Text>
        <View style={styles.choices}>
          {examples.map((item, i) => (
            <TouchableOpacity
              key={item.title}
              accessibilityRole="radio"
              accessibilityState={{ checked: i === example }}
              onPress={() => chooseExample(i)}
              style={[styles.choice, i === example && styles.highlight]}
            >
              <Text style={styles.bold}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          {lesson.title}
        </Text>
        <Text style={styles.body}>{lesson.story}</Text>
        {example === 0 && (
          <>
            <Text style={styles.label}>STARTING NUMBER</Text>
            <View style={styles.choices}>
              {inputs.map((value) => (
                <TouchableOpacity
                  key={value}
                  accessibilityRole="radio"
                  accessibilityLabel={`Start with ${value}`}
                  accessibilityState={{ checked: input === value }}
                  onPress={() => {
                    setInput(value);
                    setIndex(0);
                  }}
                  style={[styles.choice, input === value && styles.highlight]}
                >
                  <Text style={styles.bold}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        <View key={example} style={styles.codeCard}>
          {lesson.code.map((line, i) => (
            <View key={i} style={[styles.codeRow, step.line === i + 1 && styles.highlight]}>
              <Text style={styles.lineNumber}>{i + 1}</Text>
              <Text selectable style={styles.code}>
                {line}
              </Text>
            </View>
          ))}
        </View>

        <Animated.View
          accessibilityLiveRegion="polite"
          style={[
            styles.event,
            {
              opacity: transition,
              transform: [
                { translateY: transition.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) },
              ],
            },
          ]}
        >
          <Text style={styles.bold}>{step.title}</Text>
          <Text style={styles.body}>{step.detail}</Text>
        </Animated.View>
        {step.returned && (
          <View style={styles.result}>
            <Ionicons
              name={done ? 'checkmark-circle' : 'return-down-back'}
              size={21}
              color={theme.text}
            />
            <Text style={[styles.bold, { flex: 1 }]}>
              {done
                ? `Final result: ${step.returned.value}`
                : `${step.returned.call} sent back ${step.returned.value}`}
            </Text>
          </View>
        )}
        <Text accessibilityRole="header" style={styles.label}>
          CALL STACK / TOP FIRST
        </Text>
        {step.stack.length === 0 && <Text style={styles.body}>The stack is empty.</Text>}
        {[...step.stack].reverse().map((frame, i) => (
          <View key={frame.call} style={[styles.frame, i === 0 && styles.highlight]}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.bold}>{frame.call}</Text>
              <Text style={styles.note}>{frame.status}</Text>
            </View>
            {i === 0 && <Text style={styles.top}>TOP</Text>}
          </View>
        ))}
        {done && (
          <View style={styles.event}>
            <Text style={styles.bold}>
              {example === examples.length - 1
                ? 'Those folders form a tree'
                : 'Connect the examples'}
            </Text>
            <Text style={styles.body}>{lesson.takeaway}</Text>
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={[styles.note, { textAlign: 'center' }]}>
          Step {index + 1} of {steps.length}
        </Text>
        <View style={styles.controls}>
          <TouchableOpacity
            accessibilityRole="button"
            disabled={index === 0}
            onPress={() => changeStep(Math.max(0, index - 1))}
            style={[styles.button, index === 0 && { opacity: 0.45 }]}
          >
            <Text style={styles.bold}>Back a step</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={advance}
            style={[styles.button, { backgroundColor: theme.primary }]}
          >
            <Text style={[styles.bold, { color: theme.onPrimary }]}>
              {done
                ? examples[example + 1]?.title
                  ? `Next: ${examples[example + 1].title}`
                  : 'Explore the tree'
                : index === 0
                  ? 'Step into call'
                  : 'Next step'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.background },
    content: { padding: 20, paddingTop: 12, paddingBottom: 20, gap: 10 },
    title: { color: theme.text, fontSize: 27, fontWeight: '700' },
    body: { color: theme.text, fontSize: 14, lineHeight: 20 },
    bold: { color: theme.text, fontSize: 15, fontWeight: '700' },
    note: { color: theme.textSecondary, fontSize: 12, lineHeight: 17 },
    label: {
      color: theme.textSecondary,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      marginTop: 4,
    },
    choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    choice: {
      minWidth: 44,
      minHeight: 44,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
    },
    highlight: { backgroundColor: theme.accentSoft, borderColor: theme.primary },
    codeCard: {
      borderRadius: 16,
      padding: 8,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    codeRow: { flexDirection: 'row', gap: 8, borderRadius: 6, padding: 4 },
    lineNumber: { width: 16, color: theme.textSecondary, fontSize: 12 },
    code: {
      flex: 1,
      color: theme.text,
      fontSize: 12,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    event: { gap: 4, padding: 12, borderRadius: 14, backgroundColor: theme.inputBackground },
    result: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      borderRadius: 14,
      backgroundColor: theme.accentSoft,
    },
    frame: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    top: { color: theme.textSecondary, fontSize: 10, fontWeight: '700' },
    footer: {
      padding: 12,
      gap: 8,
      borderTopWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.background,
    },
    controls: { flexDirection: 'row', gap: 10 },
    button: {
      flex: 1,
      minHeight: 48,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 14,
      backgroundColor: theme.accentSoft,
    },
  });
}
