import { type ComponentRef, useReducer, useRef, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../shared/hooks/useTheme';
import { Theme } from '../../shared/theme/theme';
import { initialQueue, jobCount, playQueue, queueTrace } from './printQueue';
import QueueIllustration from './QueueIllustration';
import QueueBoard from './QueueBoard';

const source =
  'https://opendsa-server.cs.vt.edu/ODSA/Books/pubbook/odsa-all/fall-2019/Public_Instance/html/Queue.html';

export default function QueueLessonScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const scroll = useRef<ComponentRef<typeof ScrollView>>(null);
  const gameOffset = useRef(0);
  const [step, setStep] = useState(0);
  const [game, dispatch] = useReducer(playQueue, initialQueue);
  const [sourceError, setSourceError] = useState(false);
  const trace = queueTrace[step];
  const complete = game.printed.length === jobCount;

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.screen}>
      <ScrollView ref={scroll} contentContainerStyle={styles.content}>
        <QueueIllustration />
        <Text style={styles.eyebrow}>DATA STRUCTURES LAB / QUEUES</Text>
        <Text accessibilityRole="header" style={styles.title}>
          Who prints next?
        </Text>
        <Text style={styles.body}>
          A queue is a line. When three people share a printer, the first file in the line prints
          first. New files join the end.
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.primary}
          onPress={() => scroll.current?.scrollTo({ y: gameOffset.current, animated: false })}
        >
          <Ionicons name="game-controller-outline" size={20} color={theme.onPrimary} />
          <Text style={styles.primaryText}>Play: Run the printer</Text>
        </TouchableOpacity>

        <Text accessibilityRole="header" style={styles.heading}>
          How a queue works
        </Text>
        <Text style={styles.body}>
          First in, first out (FIFO). Enqueue adds a job at the back. Dequeue removes the job at the
          front.
        </Text>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>
            TRACE / STEP {step + 1} OF {queueTrace.length}
          </Text>
          <Text selectable style={styles.code}>
            {trace.code}
          </Text>
          <Text style={styles.body} accessibilityLiveRegion="polite">
            {trace.explanation}
          </Text>
          <Text style={styles.eyebrow}>FRONT TO BACK</Text>
          <Text style={styles.queueOrder}>{trace.waiting.join('  >  ')}</Text>
          <View style={styles.controls}>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={step === 0}
              onPress={() => setStep((value) => Math.max(0, value - 1))}
              style={[styles.secondary, step === 0 && styles.disabled]}
            >
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={step === queueTrace.length - 1}
              onPress={() => setStep((value) => Math.min(queueTrace.length - 1, value + 1))}
              style={[styles.secondary, step === queueTrace.length - 1 && styles.disabled]}
            >
              <Text style={styles.buttonText}>Next step</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.caption}>
          This small example uses an array. A ring buffer can advance a front index when it removes
          a job.
        </Text>

        <View
          onLayout={(event) => {
            gameOffset.current = event.nativeEvent.layout.y;
          }}
          style={styles.game}
        >
          <Text style={styles.eyebrow}>MINI GAME / PRINT DESK</Text>
          <Text accessibilityRole="header" style={styles.title}>
            Run the printer
          </Text>
          <Text style={styles.body}>Fill the tray by printing all 3 blocks in order.</Text>
          <View style={styles.feedback}>
            <Text style={styles.queueOrder}>
              {game.printed.length} of {jobCount} printed
            </Text>
            <Text accessibilityLiveRegion="polite" style={styles.body}>
              {game.message}
            </Text>
          </View>
          <QueueBoard game={game} dispatch={dispatch} />
          {complete && (
            <Text
              accessibilityLiveRegion="polite"
              style={[styles.queueOrder, { marginBottom: 12 }]}
            >
              You did it! All 3 blocks printed in order.
            </Text>
          )}
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.secondary}
            onPress={() => dispatch({ type: 'reset' })}
          >
            <Text style={styles.buttonText}>{complete ? 'Play again' : 'Reset game'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          accessibilityRole="link"
          style={styles.source}
          onPress={() => {
            setSourceError(false);
            void Linking.openURL(source).catch(() => setSourceError(true));
          }}
        >
          <Text style={styles.buttonText}>Read more about queues on OpenDSA</Text>
        </TouchableOpacity>
        {sourceError && (
          <Text accessibilityRole="alert" style={styles.caption}>
            Could not open the reference.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.background },
    content: { padding: 24, paddingTop: 12, paddingBottom: 32 },
    eyebrow: { color: theme.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    title: { color: theme.text, fontSize: 28, fontWeight: '700', marginVertical: 8 },
    heading: { color: theme.text, fontSize: 21, fontWeight: '700', marginTop: 24, marginBottom: 8 },
    body: { color: theme.text, fontSize: 15, lineHeight: 22 },
    caption: { color: theme.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 8 },
    primary: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      minHeight: 48,
      padding: 12,
      marginTop: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
    },
    primaryText: { color: theme.onPrimary, fontSize: 15, fontWeight: '700' },
    card: {
      backgroundColor: theme.card,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      marginTop: 12,
      marginBottom: 12,
      gap: 10,
    },
    code: {
      color: theme.text,
      backgroundColor: theme.accentSoft,
      padding: 12,
      borderRadius: 10,
      fontFamily: 'monospace',
      fontSize: 13,
    },
    queueOrder: { color: theme.text, fontWeight: '700', fontSize: 15 },
    controls: { flexDirection: 'row', gap: 10 },
    secondary: {
      flexGrow: 1,
      backgroundColor: theme.accentSoft,
      borderRadius: 12,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    buttonText: { color: theme.text, fontSize: 14, fontWeight: '600' },
    disabled: { opacity: 0.45 },
    game: { borderTopWidth: 1, borderTopColor: theme.border, marginTop: 24, paddingTop: 16 },
    feedback: { backgroundColor: theme.card, padding: 14, borderRadius: 14, gap: 8, marginTop: 12 },
    source: { minHeight: 44, justifyContent: 'center', marginTop: 12 },
  });
}
