import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../shared/hooks/useTheme';
import { initialQueue, jobs, nextJob, playQueue } from './printQueue';

const LINE_Y = 32;
const TRAY_Y = 152;
const INCOMING_Y = 248;
const colors = [
  ['#FFDB8A', '#C58938'],
  ['#A8DCCA', '#559D89'],
  ['#BBD1FD', '#6D8BBF'],
];
type Location = 'incoming' | 'line' | 'printed';

export default function QueueBoard({
  game,
  dispatch,
}: {
  game: typeof initialQueue;
  dispatch: (action: Parameters<typeof playQueue>[1]) => void;
}) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(true);
  const upcoming = nextJob(game);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (active) setReduceMotion(enabled);
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const slot = width / 4;
  const size = Math.min(66, slot - 6);
  const x = (column: number) => (column + 0.5) * slot - size / 2;
  const slots = (y: number) =>
    [1, 2, 3].map((column) => (
      <View
        key={column}
        style={[
          styles.slot,
          { left: x(column), top: y, width: size, height: size, borderColor: theme.border },
        ]}
      />
    ));

  return (
    <View
      style={[
        styles.board,
        { height: upcoming ? 326 : 232, backgroundColor: theme.card, borderColor: theme.border },
      ]}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width - 2)}
    >
      {size > 0 && (
        <>
          <Text style={[styles.label, { color: theme.textSecondary }]}>WAITING TO PRINT</Text>
          <View
            style={[
              styles.printer,
              { left: x(0), width: size, height: size, backgroundColor: theme.accentSoft },
            ]}
          >
            <Ionicons name="print" size={29} color={theme.text} />
          </View>
          {game.waiting.length > 0 ? (
            <Text
              maxFontSizeMultiplier={1.2}
              style={[
                styles.nextLabel,
                { left: slot, width: slot, top: LINE_Y + size + 6, color: theme.text },
              ]}
            >
              Print next
            </Text>
          ) : (
            <Text style={[styles.empty, { left: slot + 8, color: theme.textSecondary }]}>
              Nothing waiting
            </Text>
          )}
          <Text style={[styles.label, { top: 129, color: theme.textSecondary }]}>PRINTED TRAY</Text>
          {slots(TRAY_Y)}
          {upcoming && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Add block 3 to the back of the line"
              onPress={() => dispatch({ type: 'add' })}
              style={[
                styles.addButton,
                { height: size, paddingLeft: slot + 8, backgroundColor: theme.inputBackground },
              ]}
            >
              <Text style={{ color: theme.text, fontSize: 15, fontWeight: '700' }}>
                Add block 3
              </Text>
              <Ionicons name="add-circle-outline" size={22} color={theme.text} />
            </TouchableOpacity>
          )}
          {jobs.map((job, index) => {
            const waitingIndex = game.waiting.indexOf(job);
            const printedIndex = game.printed.indexOf(job);
            const location =
              printedIndex >= 0 ? 'printed' : waitingIndex >= 0 ? 'line' : 'incoming';
            const column = location === 'printed' ? printedIndex + 1 : waitingIndex + 1;
            const top = location === 'printed' ? TRAY_Y : location === 'line' ? LINE_Y : INCOMING_Y;
            return (
              <JobBlock
                key={job}
                x={x(column)}
                y={top}
                size={size}
                number={index + 1}
                location={location}
                first={waitingIndex === 0}
                printerX={x(0)}
                reduceMotion={reduceMotion}
                onPress={() =>
                  dispatch(location === 'incoming' ? { type: 'add' } : { type: 'print', job })
                }
              />
            );
          })}
        </>
      )}
    </View>
  );
}

function JobBlock({
  x,
  y,
  size,
  number,
  location,
  first,
  printerX,
  reduceMotion,
  onPress,
}: {
  x: number;
  y: number;
  size: number;
  number: number;
  location: Location;
  first: boolean;
  printerX: number;
  reduceMotion: boolean;
  onPress: () => void;
}) {
  const position = useRef(new Animated.ValueXY({ x, y })).current;
  const shake = useRef(new Animated.Value(0)).current;
  const previousLocation = useRef(location);
  useEffect(() => {
    const throughPrinter = previousLocation.current === 'line' && location === 'printed';
    previousLocation.current = location;
    if (reduceMotion) {
      position.setValue({ x, y });
      return;
    }
    const move = Animated.timing(position, {
      toValue: { x, y },
      duration: 230,
      useNativeDriver: true,
    });
    const animation = throughPrinter
      ? Animated.sequence([
          Animated.timing(position, {
            toValue: { x: printerX, y: LINE_Y },
            duration: 180,
            useNativeDriver: true,
          }),
          move,
        ])
      : move;
    animation.start();
    return () => animation.stop();
  }, [location, position, printerX, reduceMotion, x, y]);

  function press() {
    if (location === 'line' && !first && !reduceMotion) {
      shake.stopAnimation();
      shake.setValue(0);
      Animated.sequence(
        [-5, 5, 0].map((toValue) =>
          Animated.timing(shake, { toValue, duration: 65, useNativeDriver: true }),
        ),
      ).start();
    }
    onPress();
  }

  const [face, edge] = colors[number - 1];
  const cube = (
    <>
      <Text maxFontSizeMultiplier={1.5} style={styles.number}>
        {number}
      </Text>
      {location === 'printed' && <Ionicons name="checkmark" size={14} color="#163B34" />}
    </>
  );
  const cubeStyle = [
    styles.cube,
    { width: size, height: size, backgroundColor: face, borderColor: edge },
  ];
  return (
    <Animated.View
      pointerEvents={location === 'incoming' ? 'none' : 'auto'}
      style={[
        styles.block,
        {
          transform: [{ translateX: Animated.add(position.x, shake) }, { translateY: position.y }],
        },
      ]}
    >
      {location !== 'line' ? (
        <View
          accessible={location === 'printed'}
          accessibilityLabel={`Block ${number} printed`}
          style={cubeStyle}
        >
          {cube}
        </View>
      ) : (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Print block ${number}${first ? ', first in line' : ''}`}
          onPress={press}
          style={cubeStyle}
        >
          {cube}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  board: { borderRadius: 18, borderWidth: 1, marginVertical: 12 },
  label: { position: 'absolute', left: 12, top: 9, fontSize: 11, fontWeight: '700' },
  printer: {
    position: 'absolute',
    top: LINE_Y,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: { position: 'absolute', borderRadius: 12, borderWidth: 1, borderStyle: 'dashed' },
  nextLabel: { position: 'absolute', textAlign: 'center', fontSize: 12, fontWeight: '700' },
  empty: { position: 'absolute', top: LINE_Y + 18, right: 12, fontSize: 14 },
  addButton: {
    position: 'absolute',
    top: INCOMING_Y,
    left: 4,
    right: 8,
    borderRadius: 12,
    paddingRight: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  block: { position: 'absolute', left: 0, top: 0 },
  cube: {
    borderRadius: 12,
    borderBottomWidth: 6,
    borderRightWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: { color: '#163B34', fontSize: 26, fontWeight: '800' },
});
