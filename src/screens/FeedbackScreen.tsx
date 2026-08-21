import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Types';

type FeedbackScreenRouteProp = RouteProp<AppStackParamList, 'FeedbackScreen'>;
type FeedbackScreenNavProp = NativeStackNavigationProp<AppStackParamList, 'FeedbackScreen'>;

export default function FeedbackScreen() {
  const route = useRoute<FeedbackScreenRouteProp>();
  const navigation = useNavigation<FeedbackScreenNavProp>();
  const { attempt } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scoreCircle}>
        <Text style={styles.scoreText}>{attempt.aiScore}</Text>
        <Text style={styles.scoreLabel}>/ 100</Text>
      </View>

      <Text style={styles.feedbackLabel}>Feedback</Text>
      <Text style={styles.feedbackText}>{attempt.aiFeedback}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QuestionSetup')}>
        <Text style={styles.buttonText}>Try Another Question</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.secondaryButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, alignItems: 'center' },
  scoreCircle: {
    marginTop: 24,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: { color: '#fff', fontSize: 40, fontWeight: '700' },
  scoreLabel: { color: '#ccc', fontSize: 14 },
  feedbackLabel: { fontSize: 16, fontWeight: '600', marginTop: 32, alignSelf: 'flex-start' },
  feedbackText: { fontSize: 15, lineHeight: 22, marginTop: 8, color: '#333' },
  button: { marginTop: 32, backgroundColor: '#333', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  secondaryButton: { marginTop: 12, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  secondaryButtonText: { color: '#333', fontWeight: '600' },
});