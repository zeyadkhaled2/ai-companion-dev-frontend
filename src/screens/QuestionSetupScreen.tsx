import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, Difficulty } from '../types/questionTypes';
import { generateQuestionRequest } from '../services/questionApi';
import { AppStackParamList } from '../navigation/Types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';

const CATEGORIES: Category[] = ['React', 'Node', 'JavaScript', 'HR', 'SQL'];
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export default function QuestionSetupScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  type QuestionSetupNavProp = NativeStackNavigationProp<AppStackParamList, 'QuestionSetup'>;

  const navigation = useNavigation<QuestionSetupNavProp>();
  const handleGenerate = async () => {
    if (!selectedCategory || !selectedDifficulty) return;
    setIsGenerating(true);
    try {
      const result = await generateQuestionRequest(selectedCategory, selectedDifficulty);
      console.log(result.question);
      navigation.navigate('QuestionDisplay', { question: result.question });
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to generate question. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Choose a category</Text>
      <View style={styles.row}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={selectedCategory === cat ? styles.chipTextSelected : styles.chipText}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Choose difficulty</Text>
      <View style={styles.row}>
        {DIFFICULTIES.map((diff) => (
          <TouchableOpacity
            key={diff}
            style={[styles.chip, selectedDifficulty === diff && styles.chipSelected]}
            onPress={() => setSelectedDifficulty(diff)}
          >
            <Text style={selectedDifficulty === diff ? styles.chipTextSelected : styles.chipText}>
              {diff}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.generateButton, (!selectedCategory || !selectedDifficulty) && styles.generateButtonDisabled]}
        onPress={handleGenerate}
        disabled={!selectedCategory || !selectedDifficulty || isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.generateButtonText}>Generate Question</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#ccc' },
  chipSelected: { backgroundColor: '#333', borderColor: '#333' },
  chipText: { color: '#333' },
  chipTextSelected: { color: '#fff' },
  generateButton: {
    marginTop: 24,
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonDisabled: {
    backgroundColor: '#aaa',
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});