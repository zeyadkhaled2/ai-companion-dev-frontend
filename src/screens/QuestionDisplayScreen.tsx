import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Types';
import { submitAnswerRequest } from '../services/attemptApi';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../constants/theme';
import { Keyboard } from 'react-native';

type QuestionDisplayRouteProp = RouteProp<AppStackParamList, 'QuestionDisplay'>;
type QuestionDisplayNavProp = NativeStackNavigationProp<AppStackParamList, 'QuestionDisplay'>;

export default function QuestionDisplayScreen() {
  const route = useRoute<QuestionDisplayRouteProp>();
  const navigation = useNavigation<QuestionDisplayNavProp>();
  const { question } = route.params;
  const theme = useTheme();
  const styles = createStyles(theme);
  const headerHeight = useHeaderHeight();

  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (userAnswer.trim().length === 0) {
      setErrorMessage("This field is required");
      return;
    }
    setIsSubmitting(true);
    Keyboard.dismiss();
    setErrorMessage(null);

    try {
      const result = await submitAnswerRequest({ questionId: question.id, userAnswer });
      if (navigation.isFocused()) navigation.replace('FeedbackScreen', { attempt: result });
    } catch (err: any) {
      setErrorMessage('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={headerHeight}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <Text style={styles.question}>{question.content}</Text>

        <TextInput
          style={styles.input}
          placeholder="Type your answer here..."
          placeholderTextColor={theme.placeholder}
          multiline
          numberOfLines={6}
          value={userAnswer}
          editable={!isSubmitting}
          onChangeText={value => { setUserAnswer(value); if (value.trim()) setErrorMessage(null); }}
          textAlignVertical="top"
        />

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Answer</Text>}
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>

  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { padding: 16, flexGrow: 1, backgroundColor: theme.background },
    question: { fontSize: 20, fontWeight: '600', marginBottom: 16, lineHeight: 28, color: theme.text },
    input: { borderWidth: 1, borderColor: theme.border, borderRadius: 8, padding: 12, minHeight: 140, fontSize: 15, backgroundColor: theme.card, color: theme.text },
    errorText: { color: theme.danger, marginTop: 8 },
    button: { marginTop: 16, backgroundColor: theme.buttonDark, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  });
}
