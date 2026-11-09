import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function AiErrorNotice({
  message,
  onPractice,
}: {
  message: string;
  onPractice: () => void;
}) {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.card, borderRadius: 12, padding: 12, marginVertical: 6 }}>
      <Text accessibilityRole="alert" style={{ color: theme.danger, lineHeight: 19 }}>
        {message}
      </Text>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onPractice}
        style={{ minHeight: 44, justifyContent: 'center' }}
      >
        <Text style={{ color: theme.text, fontWeight: '700' }}>Try a JavaScript challenge</Text>
      </TouchableOpacity>
    </View>
  );
}
