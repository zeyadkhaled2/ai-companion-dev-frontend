import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../theme/theme';

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
