import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Avatar from './Avatar';
import { useTheme } from '../hooks/useTheme';
export default function PhotoPicker({
  photo,
  name,
  onChange,
  optional = false,
  disabled = false,
  onBusyChange,
}: {
  photo?: string | null;
  name?: string;
  onChange: (photo: string | null) => Promise<void> | void;
  optional?: boolean;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const theme = useTheme();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function choose(remove = false) {
    if (busy || disabled) return;
    setBusy(true);
    onBusyChange?.(true);
    setError('');
    try {
      if (remove) {
        await onChange(null);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const side = Math.min(asset.width, asset.height);
      const image = await manipulateAsync(
        asset.uri,
        [
          {
            crop: {
              originX: Math.floor((asset.width - side) / 2),
              originY: Math.floor((asset.height - side) / 2),
              width: side,
              height: side,
            },
          },
          { resize: { width: 256 } },
        ],
        { compress: 0.8, format: SaveFormat.JPEG, base64: true },
      );
      if (!image.base64 || image.base64.length > 409600) throw new Error('size');
      await onChange(`data:image/jpeg;base64,${image.base64}`);
    } catch {
      setError('Could not save this photo. Please try another image or check your connection.');
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  }
  return (
    <View style={{ alignItems: 'center', gap: 12, marginVertical: 20 }}>
      <Avatar photo={photo} name={name} size={88} />
      <TouchableOpacity
        accessibilityRole="button"
        disabled={busy || disabled}
        onPress={() => choose()}
        style={{
          minHeight: 44,
          justifyContent: 'center',
          paddingHorizontal: 20,
          borderRadius: 16,
          backgroundColor: theme.accentSoft,
        }}
      >
        {busy ? (
          <ActivityIndicator color={theme.primary} />
        ) : (
          <Text style={{ color: theme.text, fontWeight: '600' }}>
            {photo ? 'Change photo' : 'Add profile photo'}
            {optional ? ' / Optional' : ''}
          </Text>
        )}
      </TouchableOpacity>
      {!!photo && (
        <TouchableOpacity
          accessibilityRole="button"
          disabled={busy || disabled}
          onPress={() => choose(true)}
          style={{ minHeight: 44, justifyContent: 'center' }}
        >
          <Text style={{ color: theme.danger }}>Remove photo</Text>
        </TouchableOpacity>
      )}
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: theme.danger, textAlign: 'center' }}>
          {error}
        </Text>
      )}
    </View>
  );
}
