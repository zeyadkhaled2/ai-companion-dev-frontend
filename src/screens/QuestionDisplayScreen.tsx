import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/types';
import { submitAnswerRequest } from '../services/attemptApi';


type QuestionDisplayRouteProp = RouteProp<AppStackParamList, 'QuestionDisplay'>;
type QuestionDisplayNavProp = NativeStackNavigationProp<AppStackParamList, 'QuestionDisplay'>;

export default function QuestionDisplayScreen() {
  const route = useRoute<QuestionDisplayRouteProp>();
  const navigation = useNavigation<QuestionDisplayNavProp>();
  const { question } = route.params;

  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (userAnswer.trim().length === 0) {
      setErrorMessage("This field is required");
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await submitAnswerRequest({ questionId: question.id, userAnswer });
      navigation.navigate('FeedbackScreen', { attempt: result.attempt });
    } catch (err: any) {
      console.log('Error message:', err.message);
      console.log('Error response status:', err.response?.status);
      console.log('Error response data:', err.response?.data);
      console.log('Error request made?', !!err.request);
      setErrorMessage('Failed to submit answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.question}>{question.content}</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your answer here..."
        multiline
        numberOfLines={6}
        value={userAnswer}
        onChangeText={setUserAnswer}
        textAlignVertical="top"
      />

      {errorMessage && <Text style={{ color: 'red' }}>{errorMessage}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Answer</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  question: { fontSize: 20, fontWeight: '600', marginBottom: 16, lineHeight: 28 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, minHeight: 140, fontSize: 15 },
  button: { marginTop: 16, backgroundColor: '#333', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});