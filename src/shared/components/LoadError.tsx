import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  const theme = useTheme();
  return (
    <View style={{ padding: 16, alignItems: 'center' }}>
      <Text accessibilityRole="alert" style={{ color: theme.danger, textAlign: 'center' }}>
        {message}
      </Text>
      <TouchableOpacity accessibilityRole="button" onPress={onRetry} style={{ padding: 14 }}>
        <Text style={{ color: theme.primary, fontWeight: '600' }}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}
