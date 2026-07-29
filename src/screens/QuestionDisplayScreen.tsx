import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Types';

type QuestionDisplayRouteProp = RouteProp<AppStackParamList, 'QuestionDisplay'>;
type QuestionDisplayNavProp = NativeStackNavigationProp<AppStackParamList, 'QuestionDisplay'>;

export default function QuestionDisplayScreen() {
  const route = useRoute<QuestionDisplayRouteProp>();
  const navigation = useNavigation<QuestionDisplayNavProp>();
  const { question } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Your Question</Text>
      <Text style={styles.question}>{question.content}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QuestionSetup')}>
        <Text style={styles.buttonText}>Try Another Question</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  label: { fontSize: 14, color: '#666', marginBottom: 8 },
  question: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  button: { marginTop: 32, backgroundColor: '#333', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
});