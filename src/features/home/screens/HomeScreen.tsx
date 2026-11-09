import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../app/navigation/types';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useAuthStore } from '../../auth/store/authStore';
import Avatar from '../../../shared/components/Avatar';
import { useStreak } from '../../streak/StreakProvider';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const theme = useTheme();
  const greeting = useAuthStore((state) => state.greeting);
  const user = useAuthStore((state) => state.user);
  const { streak, error: streakError, retry: retryStreak } = useStreak();
  const streakLabel = streakError
    ? 'Retry streak check-in'
    : streak
      ? `${streak.current} ${streak.current === 1 ? 'day' : 'days'} in a row`
      : 'Checking streak...';
  const modes = [
    {
      title: 'Quick JavaScript challenge',
      description: 'Predict what the code prints, then trace it step by step.',
      icon: 'terminal-outline',
      onPress: () => navigation.navigate('OutputChallenge', { difficulty: 'Easy', fromHome: true }),
    },
    {
      title: 'Interview practice',
      description: 'Choose a topic and level, then get feedback on your answer.',
      icon: 'chatbox-ellipses-outline',
      onPress: () => navigation.navigate('QuestionSetup'),
    },
    {
      title: 'Data Structures Lab',
      description: 'Play with queues and trace the recursion call stack.',
      icon: 'layers-outline',
      onPress: () => navigation.navigate('DataStructuresLab'),
    },
  ] as const;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 140 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ color: theme.text, fontSize: 19, fontWeight: '600' }}>
              Welcome back, {greeting}.
            </Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open your account"
            onPress={() => navigation.navigate('Tabs', { screen: 'Account' })}
          >
            <Avatar photo={user?.photo} name={user?.name} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={streakError ? streakLabel : `${streakLabel}. Open Progress`}
          onPress={
            streakError ? retryStreak : () => navigation.navigate('Tabs', { screen: 'Dashboard' })
          }
          style={{
            alignSelf: 'flex-start',
            backgroundColor: theme.accentSoft,
            borderRadius: 22,
            minHeight: 44,
            paddingHorizontal: 14,
            paddingVertical: 8,
            gap: 7,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Ionicons name="flame" size={17} color={theme.text} />
          <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600', flexShrink: 1 }}>
            {streakLabel}
          </Text>
        </TouchableOpacity>
        <Text
          accessibilityRole="header"
          style={{
            color: theme.text,
            fontSize: 32,
            fontWeight: '700',
            letterSpacing: -0.7,
            marginBottom: 16,
          }}
        >
          Practice today
        </Text>
        {modes.map((mode, index) => {
          const featured = index === 0;
          const foreground = featured ? '#FFFDF4' : theme.text;
          const supporting = featured ? '#C6DBC8' : theme.textSecondary;
          return (
            <TouchableOpacity
              key={mode.title}
              accessibilityRole="button"
              accessibilityLabel={mode.title}
              accessibilityHint={mode.description}
              onPress={mode.onPress}
              activeOpacity={0.8}
              style={{
                backgroundColor: featured ? theme.hero : theme.card,
                borderWidth: 1,
                borderColor: featured ? theme.hero : theme.border,
                borderRadius: 22,
                padding: 18,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <View
                style={{
                  padding: 10,
                  borderRadius: 14,
                  backgroundColor: featured ? '#31594D' : theme.accentSoft,
                }}
              >
                <Ionicons name={mode.icon} size={23} color={foreground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: foreground, fontSize: 17, fontWeight: '700' }}>
                  {mode.title}
                </Text>
                <Text style={{ color: supporting, fontSize: 13, lineHeight: 19, marginTop: 4 }}>
                  {mode.description}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={foreground} />
            </TouchableOpacity>
          );
        })}
        <Text
          style={{
            color: theme.text,
            fontSize: 20,
            fontWeight: '700',
            marginTop: 20,
            marginBottom: 16,
          }}
        >
          Keep moving forward
        </Text>
        {(
          [
            {
              title: 'Talk it through',
              text: 'Explore concepts with your AI mentor',
              icon: 'chatbubbles-outline',
              screen: 'Chat',
            },
            {
              title: 'See your growth',
              text: 'Review scores and spot your strengths',
              icon: 'trending-up-outline',
              screen: 'Dashboard',
            },
          ] as const
        ).map((item) => (
          <TouchableOpacity
            key={item.screen}
            accessibilityRole="button"
            onPress={() => navigation.navigate('Tabs', { screen: item.screen })}
            style={{
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 20,
              padding: 20,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <Ionicons name={item.icon} size={26} color={theme.text} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>
                {item.title}
              </Text>
              <Text
                style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 19, marginTop: 4 }}
              >
                {item.text}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.chevron} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
