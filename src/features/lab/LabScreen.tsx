import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppStackParamList } from '../../app/navigation/types';
import { useTheme } from '../../shared/hooks/useTheme';

const lessons = [
  {
    route: 'QueueLesson',
    title: 'Queues',
    description: 'Send blocks through a toy printer.',
    icon: 'print-outline',
  },
  {
    route: 'RecursionLesson',
    title: 'Recursion',
    description: 'Step into calls and watch their results come back.',
    icon: 'layers-outline',
  },
  {
    route: 'TreeTraversal',
    title: 'Tree traversal',
    description: 'Explore a folder tree one branch at a time.',
    icon: 'git-branch-outline',
  },
] as const;

export default function LabScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  return (
    <SafeAreaView
      edges={['left', 'right', 'bottom']}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 12, gap: 14 }}>
        <Text
          accessibilityRole="header"
          style={{ color: theme.text, fontSize: 28, fontWeight: '700' }}
        >
          Pick a lab
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 15, lineHeight: 22 }}>
          Follow the code, then see what changes as you tap.
        </Text>
        {lessons.map((lesson) => (
          <TouchableOpacity
            key={lesson.route}
            accessibilityRole="button"
            accessibilityLabel={lesson.title}
            accessibilityHint={lesson.description}
            onPress={() => navigation.navigate(lesson.route)}
            style={{
              padding: 18,
              borderRadius: 18,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <Ionicons name={lesson.icon} size={25} color={theme.primary} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700' }}>
                {lesson.title}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 14 }}>{lesson.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
