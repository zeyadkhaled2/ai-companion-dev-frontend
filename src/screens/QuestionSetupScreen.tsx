import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, Difficulty } from '../types/questionTypes';
import { generateQuestionRequest } from '../services/questionApi';
import { AppStackParamList } from '../navigation/Types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../hooks/useTheme';
import { Theme } from '../constants/theme';

const CATEGORIES: Category[] = ['React', 'Node', 'JavaScript', 'HR', 'SQL'];
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

type QuestionSetupNavProp = NativeStackNavigationProp<AppStackParamList, 'QuestionSetup'>;

export default function QuestionSetupScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigation = useNavigation<QuestionSetupNavProp>();
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleGenerate = async () => {
    if (!selectedCategory || !selectedDifficulty) return;
    setIsGenerating(true);
    try {
      const result = await generateQuestionRequest(selectedCategory, selectedDifficulty);
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
            <Text style={selectedCategory === cat ? styles.chipTextSelected : styles.chipText}>{cat}</Text>
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
            <Text style={selectedDifficulty === diff ? styles.chipTextSelected : styles.chipText}>{diff}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

      <TouchableOpacity
        style={[styles.generateButton, (!selectedCategory || !selectedDifficulty) && styles.generateButtonDisabled]}
        onPress={handleGenerate}
        disabled={!selectedCategory || !selectedDifficulty || isGenerating}
      >
        {isGenerating ? <ActivityIndicator color="#fff" /> : <Text style={styles.generateButtonText}>Generate Question</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: { padding: 16, flex: 1, backgroundColor: theme.background },
    label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8, color: theme.text },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card },
    chipSelected: { backgroundColor: theme.primary, borderColor: theme.primary },
    chipText: { color: theme.text },
    chipTextSelected: { color: '#fff' },
    errorText: { color: theme.danger, marginTop: 12 },
    generateButton: { marginTop: 24, backgroundColor: theme.buttonDark, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
    generateButtonDisabled: { backgroundColor: theme.textSecondary },
    generateButtonText: { color: '#fff', fontWeight: '600' },
  });
}