import { Image, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
export default function Avatar({
  photo,
  name,
  size = 48,
}: {
  photo?: string | null;
  name?: string;
  size?: number;
}) {
  const theme = useTheme();
  const initials =
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase() || 'DC';
  return photo ? (
    <Image
      accessibilityLabel="Profile photo"
      source={{ uri: photo }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  ) : (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.accentSoft,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: theme.text, fontSize: size * 0.32, fontWeight: '700' }}>
        {initials}
      </Text>
    </View>
  );
}
