import { type ComponentRef, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../app/navigation/types';
import { useAuthStore } from '../../auth/store/authStore';
import { Difficulty } from '../../practice/types/questionTypes';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Theme } from '../../../shared/theme/theme';
import { OutputChallenge } from '../data/challenges';
import {
  loadOutputResults,
  saveOutputResults,
  orderChallenges,
  OutputResults as Results,
} from '../data/progress';

export default function OutputChallengeScreen() {
  const { params } = useRoute<RouteProp<AppStackParamList, 'OutputChallenge'>>();
  const user = useAuthStore((state) => state.user);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const theme = useTheme();
  const [profileError, setProfileError] = useState(false);
  useEffect(() => {
    if (!user) refreshProfile().catch(() => setProfileError(true));
  }, [user, refreshProfile]);
  if (!user)
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.background,
          padding: 24,
          justifyContent: 'center',
        }}
      >
        {profileError ? (
          <TouchableOpacity
            onPress={() => {
              setProfileError(false);
              refreshProfile().catch(() => setProfileError(true));
            }}
          >
            <Text style={{ color: theme.text }}>Could not load your account. Tap to retry.</Text>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator color={theme.primary} />
        )}
      </SafeAreaView>
    );
  return (
    <ChallengeSession
      key={`${user.id}:${params.difficulty}`}
      userId={user.id}
      difficulty={params.difficulty}
      backLabel={
        params.fromHome
          ? 'Back to Home'
          : params.returnTo === 'mentor'
            ? 'Back to Mentor'
            : params.returnTo === 'interview'
              ? 'Back to interview'
              : 'Choose another level'
      }
    />
  );
}

function ChallengeSession({
  userId,
  difficulty,
  backLabel,
}: {
  userId: string;
  difficulty: Difficulty;
  backLabel: string;
}) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const [queue, setQueue] = useState<OutputChallenge[]>([]);
  const [records, setRecords] = useState<Results>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [version, setVersion] = useState(0);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const locked = useRef(false);
  const revealPending = useRef(false);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    loadOutputResults(userId)
      .then((valid) => {
        if (!active) return;
        setRecords(valid);
        setQueue(orderChallenges(difficulty, valid));
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userId, difficulty, version]);

  async function persist(next: Results) {
    setSaving(true);
    setSaveError(false);
    try {
      await saveOutputResults(userId, next);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }
  const challenge = queue[index];
  function checkAnswer() {
    if (!challenge || choice === null || locked.current) return;
    locked.current = true;
    revealPending.current = true;
    setRevealed(true);
    if (choice === challenge.answer) setCorrectCount((value) => value + 1);
    else setMissed((value) => [...value, challenge.id]);
    const next = { ...records, [challenge.id]: choice };
    setRecords(next);
    void persist(next);
  }
  function nextChallenge() {
    setIndex((value) => value + 1);
    setChoice(null);
    setRevealed(false);
    setStep(0);
    locked.current = false;
    scroll.current?.scrollTo({ y: 0, animated: false });
  }
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  if (loadError)
    return (
      <View style={styles.center}>
        <Text style={styles.body}>Could not read your saved challenges.</Text>
        <TouchableOpacity style={styles.primary} onPress={() => setVersion((value) => value + 1)}>
          <Text style={styles.primaryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  if (!challenge)
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.eyebrow}>SESSION COMPLETE</Text>
          <Text style={styles.title}>
            {correctCount} of {queue.length} correct
          </Text>
          <Text style={styles.body}>
            {missed.length
              ? 'A few useful discoveries. Revisit these concepts while they are fresh.'
              : 'Nicely reasoned. Try another level for a different challenge.'}
          </Text>
          {missed.map((id) => (
            <View key={id} style={styles.stepCard}>
              <Text style={styles.body}>{queue.find((item) => item.id === id)?.title}</Text>
            </View>
          ))}
          {!!missed.length && (
            <TouchableOpacity
              style={styles.primary}
              onPress={() => {
                setQueue(queue.filter((item) => missed.includes(item.id)));
                setIndex(0);
                setMissed([]);
                setCorrectCount(0);
              }}
            >
              <Text style={styles.primaryText}>Review missed challenges</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.secondary} onPress={() => navigation.goBack()}>
            <Text style={styles.body}>{backLabel}</Text>
          </TouchableOpacity>
          <Text style={styles.caption}>
            Progress is saved on this device for your account. No AI quota used.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  const activeStep = challenge.steps[step];
  const codeLines = challenge.code.split('\n');
  const windowStart = Math.max(0, Math.min(...activeStep.lines) - 2);
  const windowEnd = Math.min(codeLines.length, Math.max(...activeStep.lines) + 1);
  const consoleOutput = challenge.steps
    .slice(0, step + 1)
    .flatMap((item) => (item.output === undefined ? [] : [item.output]))
    .join('\n');
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
      <ScrollView ref={scroll} contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>
          JAVASCRIPT / {difficulty.toUpperCase()} / {index + 1}/{queue.length}
        </Text>
        {!revealed ? (
          <>
            <Text style={styles.title}>{challenge.title}</Text>
            <Text style={styles.body}>
              What does this code print? Each output line appears on a new line.
            </Text>
            <ScrollView horizontal style={styles.codeCard} contentContainerStyle={{ padding: 16 }}>
              <View>
                {codeLines.map((line, i) => (
                  <View key={i} style={styles.codeLine}>
                    <Text style={styles.lineNumber}>{i + 1}</Text>
                    <Text selectable style={styles.code}>
                      {line || ' '}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            {challenge.options.map((option, i) => (
              <TouchableOpacity
                key={i}
                accessibilityRole="radio"
                accessibilityState={{ checked: choice === i }}
                accessibilityLabel={`Option ${i + 1}: ${option.replace(/\n/g, ', then ')}`}
                onPress={() => setChoice(i)}
                style={[styles.option, choice === i && styles.selected]}
              >
                <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}</Text>
                <Text style={[styles.code, { flex: 1 }]}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              accessibilityRole="button"
              disabled={choice === null}
              style={[styles.primary, choice === null && { opacity: 0.5 }]}
              onPress={checkAnswer}
            >
              <Text style={styles.primaryText}>Check my prediction</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View
              onLayout={() => {
                if (!revealPending.current) return;
                revealPending.current = false;
                scroll.current?.scrollTo({ y: 0, animated: false });
              }}
            >
              <Text
                accessibilityRole="header"
                accessibilityLiveRegion="polite"
                style={styles.result}
              >
                {choice === challenge.answer ? 'You got it.' : 'Here is what actually happens.'}
              </Text>
              <View style={styles.stepCard}>
                <Text style={styles.eyebrow}>ACTUAL OUTPUT</Text>
                <Text selectable style={styles.code}>
                  {challenge.options[challenge.answer]}
                </Text>
                {choice !== challenge.answer && (
                  <Text style={styles.caption}>Your prediction: {challenge.options[choice!]}</Text>
                )}
              </View>
            </View>
            <View style={styles.stepCard}>
              <Text style={styles.eyebrow} accessibilityLiveRegion="polite">
                EXECUTION TRACE / STEP {step + 1} OF {challenge.steps.length}
              </Text>
              <ScrollView
                horizontal
                style={styles.activeCode}
                contentContainerStyle={{ padding: 8, flexGrow: 1 }}
              >
                <View style={{ flexGrow: 1 }}>
                  {codeLines.slice(windowStart, windowEnd).map((line, i) => {
                    const lineNumber = windowStart + i + 1;
                    const highlighted = activeStep.lines.includes(lineNumber);
                    return (
                      <View
                        key={lineNumber}
                        style={[styles.codeLine, highlighted && styles.highlightedLine]}
                      >
                        <Text style={styles.lineNumber}>{lineNumber}</Text>
                        <Text selectable style={[styles.code, !highlighted && styles.contextCode]}>
                          {line || ' '}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
              <Text accessibilityLiveRegion="polite" style={styles.body}>
                {activeStep.explanation}
              </Text>
              <View style={styles.console}>
                <Text style={styles.eyebrow}>CONSOLE SO FAR</Text>
                <Text selectable style={styles.code} accessibilityLiveRegion="polite">
                  {consoleOutput || 'No output yet'}
                </Text>
              </View>
              <View style={styles.stepActions}>
                <TouchableOpacity
                  accessibilityRole="button"
                  disabled={step === 0}
                  onPress={() => setStep((value) => Math.max(0, value - 1))}
                  style={[styles.stepButton, step === 0 && { opacity: 0.4 }]}
                >
                  <Text style={styles.body}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  disabled={step === challenge.steps.length - 1}
                  onPress={() =>
                    setStep((value) => Math.min(challenge.steps.length - 1, value + 1))
                  }
                  style={[
                    styles.stepButton,
                    step === challenge.steps.length - 1 && { opacity: 0.4 },
                  ]}
                >
                  <Text style={styles.body}>Next step</Text>
                </TouchableOpacity>
              </View>
            </View>
            {saveError && (
              <TouchableOpacity onPress={() => persist(records)}>
                <Text accessibilityRole="alert" style={{ color: theme.danger }}>
                  Could not save your progress. Tap to retry.
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              accessibilityRole="button"
              disabled={saving || saveError}
              style={[styles.primary, (saving || saveError) && { opacity: 0.5 }]}
              onPress={nextChallenge}
            >
              <Text style={styles.primaryText}>
                {saving
                  ? 'Saving...'
                  : index === queue.length - 1
                    ? 'See session results'
                    : 'Next challenge'}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <Text style={styles.caption}>Curated and verified. No AI calls.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
function createStyles(theme: Theme) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.background },
    center: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: theme.background },
    content: { padding: 24, paddingTop: 12, paddingBottom: 40 },
    eyebrow: {
      color: theme.textSecondary,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: 8,
    },
    title: { color: theme.text, fontSize: 27, fontWeight: '700', marginBottom: 12 },
    body: { color: theme.text, fontSize: 15, lineHeight: 22 },
    caption: { color: theme.textSecondary, fontSize: 12, lineHeight: 18, marginVertical: 12 },
    codeCard: {
      backgroundColor: theme.card,
      borderRadius: 18,
      marginVertical: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    codeLine: { flexDirection: 'row', paddingVertical: 3, borderRadius: 4 },
    code: {
      color: theme.text,
      fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
      fontSize: 13,
      lineHeight: 22,
    },
    lineNumber: { color: theme.textSecondary, fontSize: 12, width: 26, lineHeight: 22 },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      minHeight: 54,
      padding: 14,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      marginBottom: 10,
    },
    optionLetter: { color: theme.textSecondary, fontWeight: '700' },
    selected: { borderColor: theme.primary, backgroundColor: theme.accentSoft },
    primary: {
      backgroundColor: theme.primary,
      padding: 17,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 14,
      minHeight: 52,
    },
    primaryText: { color: theme.onPrimary, fontSize: 15, fontWeight: '600' },
    secondary: { padding: 16, alignItems: 'center', marginTop: 8 },
    result: { color: theme.text, fontSize: 21, fontWeight: '700', marginBottom: 12 },
    stepCard: { padding: 18, borderRadius: 18, backgroundColor: theme.card, marginBottom: 12 },
    activeCode: { backgroundColor: theme.inputBackground, borderRadius: 10, marginBottom: 12 },
    highlightedLine: { backgroundColor: theme.accentSoft },
    contextCode: { color: theme.textSecondary },
    console: {
      backgroundColor: theme.inputBackground,
      borderRadius: 10,
      padding: 12,
      marginTop: 12,
    },
    stepActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
    stepButton: {
      flex: 1,
      minHeight: 44,
      padding: 10,
      alignItems: 'center',
      backgroundColor: theme.accentSoft,
      borderRadius: 12,
    },
  });
}
