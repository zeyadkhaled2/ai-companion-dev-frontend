import { aiErrorMessage } from '../../../shared/api/apiError';
import AiErrorNotice from '../../../shared/components/AiErrorNotice';
import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Difficulty } from '../types/questionTypes';
import { generateQuestionRequest } from '../api/questionApi';
import { AppStackParamList } from '../../../app/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Theme } from '../../../shared/theme/theme';
import { PracticeTopic, usePracticePreferences } from '../store/practicePreferences';

const TOPICS: {
  value: PracticeTopic;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: 'React', description: 'Components & hooks', icon: 'logo-react' },
  { value: 'Node', description: 'APIs & backend', icon: 'server-outline' },
  { value: 'JavaScript', description: 'Language & logic', icon: 'code-slash-outline' },
  { value: 'HR', description: 'Stories & teamwork', icon: 'people-outline' },
  { value: 'SQL', description: 'Queries & data', icon: 'layers-outline' },
  { value: 'Predict output', description: 'JavaScript challenges', icon: 'terminal-outline' },
];
const LEVELS: { value: Difficulty; description: string }[] = [
  { value: 'Easy', description: 'Foundations' },
  { value: 'Medium', description: 'Apply your knowledge' },
  { value: 'Hard', description: 'Deeper reasoning' },
];
type QuestionSetupNavProp = NativeStackNavigationProp<AppStackParamList, 'QuestionSetup'>;

export default function QuestionSetupScreen() {
  const { category, difficulty, setCategory, setDifficulty } = usePracticePreferences();
  const [isGenerating, setIsGenerating] = useState(false);
  const generating = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigation = useNavigation<QuestionSetupNavProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { width, fontScale } = useWindowDimensions();
  const singleColumn = width < 360 || fontScale > 1.25;
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const ready = !!category && !!difficulty;

  const handleGenerate = async () => {
    if (!category || !difficulty || generating.current) return;
    if (category === 'Predict output') {
      navigation.navigate('OutputChallenge', { difficulty });
      return;
    }
    generating.current = true;
    setErrorMessage(null);
    setIsGenerating(true);
    try {
      const result = await generateQuestionRequest(category, difficulty);
      if (navigation.isFocused())
        navigation.navigate('QuestionDisplay', { question: result.question });
    } catch (error) {
      setErrorMessage(aiErrorMessage(error, 'Could not create your question. Please try again.'));
    } finally {
      generating.current = false;
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        onLayout={(event) => setViewportHeight(event.nativeEvent.layout.height)}
        onContentSizeChange={(_, height) => setContentHeight(height)}
        scrollEnabled={contentHeight > viewportHeight + 1}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text accessibilityRole="header" style={styles.title}>
          Set your challenge
        </Text>
        <Text style={styles.intro}>Pick a topic and a level. One question at a time.</Text>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          What will you work on?
        </Text>
        <View style={styles.topics}>
          {TOPICS.map((topic) => {
            const selected = category === topic.value;
            return (
              <TouchableOpacity
                key={topic.value}
                accessibilityRole="radio"
                accessibilityLabel={`${topic.value}. ${topic.description}`}
                accessibilityState={{ checked: selected, disabled: isGenerating }}
                disabled={isGenerating}
                activeOpacity={0.75}
                onPress={() => {
                  setCategory(topic.value);
                  setErrorMessage(null);
                }}
                style={[
                  styles.topic,
                  { width: singleColumn ? '100%' : '48%' },
                  selected && styles.selected,
                ]}
              >
                <View style={styles.topicTop}>
                  <Ionicons name={topic.icon} size={20} color={theme.text} />
                  <Text style={[styles.choiceTitle, { flex: 1 }]}>{topic.value}</Text>
                  <Ionicons
                    name="checkmark-circle"
                    size={19}
                    color={theme.primary}
                    style={{ opacity: selected ? 1 : 0 }}
                  />
                </View>
                <Text style={styles.description}>{topic.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text accessibilityRole="header" style={styles.sectionTitle}>
          Choose your level
        </Text>
        <View style={styles.levels}>
          {LEVELS.map((level) => {
            const selected = difficulty === level.value;
            return (
              <TouchableOpacity
                key={level.value}
                accessibilityRole="radio"
                accessibilityLabel={`${level.value}. ${level.description}`}
                accessibilityState={{ checked: selected, disabled: isGenerating }}
                disabled={isGenerating}
                activeOpacity={0.75}
                onPress={() => {
                  setDifficulty(level.value);
                  setErrorMessage(null);
                }}
                style={[styles.level, selected && styles.selected]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.choiceTitle}>{level.value}</Text>
                  <Text style={styles.description}>{level.description}</Text>
                </View>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={selected ? theme.primary : theme.chevron}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.reassurance}>
          <Ionicons name="leaf-outline" size={17} color={theme.textSecondary} />
          <Text style={styles.reassuranceText}>No timer. Think it through at your own pace.</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {errorMessage && (
          <AiErrorNotice
            message={errorMessage}
            onPractice={() =>
              navigation.navigate('OutputChallenge', { difficulty: 'Easy', returnTo: 'interview' })
            }
          />
        )}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ disabled: !ready || isGenerating, busy: isGenerating }}
          style={[styles.button, (!ready || isGenerating) && styles.disabled]}
          onPress={handleGenerate}
          disabled={!ready || isGenerating}
          activeOpacity={0.8}
        >
          {isGenerating && <ActivityIndicator color={theme.onPrimary} />}
          <Text style={styles.buttonText}>
            {isGenerating
              ? 'Preparing your question...'
              : errorMessage
                ? 'Retry question'
                : 'Start practice'}
          </Text>
          {!isGenerating && <Ionicons name="arrow-forward" size={20} color={theme.onPrimary} />}
        </TouchableOpacity>
        <Text style={styles.footerHint}>
          {ready
            ? category === 'Predict output'
              ? 'JavaScript challenges. No AI quota used.'
              : 'Feedback follows your answer.'
            : 'Choose a topic and level to get started.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    content: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 12 },
    title: { fontSize: 30, fontWeight: '700', color: theme.text, letterSpacing: -0.5 },
    intro: { fontSize: 15, lineHeight: 22, color: theme.textSecondary, marginTop: 6 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginTop: 18,
      marginBottom: 10,
    },
    topics: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8 },
    topic: {
      padding: 12,
      minHeight: 72,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    topicTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      minHeight: 24,
      marginBottom: 4,
    },
    choiceTitle: { fontSize: 15, fontWeight: '600', color: theme.text },
    description: { fontSize: 12, lineHeight: 18, color: theme.textSecondary, marginTop: 3 },
    selected: { backgroundColor: theme.accentSoft, borderColor: theme.primary },
    levels: { gap: 8 },
    level: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 60,
      paddingVertical: 9,
      paddingHorizontal: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    reassurance: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
    reassuranceText: { flex: 1, color: theme.textSecondary, fontSize: 12, lineHeight: 18 },
    footer: {
      paddingHorizontal: 24,
      paddingTop: 14,
      paddingBottom: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      backgroundColor: theme.background,
    },
    button: {
      backgroundColor: theme.primary,
      minHeight: 54,
      paddingVertical: 15,
      paddingHorizontal: 16,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    disabled: { opacity: 0.55 },
    buttonText: { color: theme.onPrimary, fontSize: 16, fontWeight: '600', flexShrink: 1 },
    footerHint: {
      textAlign: 'center',
      color: theme.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 10,
    },
    errorText: { color: theme.danger, fontSize: 13, lineHeight: 19, marginBottom: 12 },
  });
}
