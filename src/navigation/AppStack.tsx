import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './Types';
import MainTabs from './MainTabs';
import QuestionSetupScreen from '../screens/QuestionSetupScreen';
import QuestionDisplayScreen from '../screens/QuestionDisplayScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="QuestionSetup" component={QuestionSetupScreen} options={{ title: 'New Question', headerBackTitle: '' }} />
      <Stack.Screen name="QuestionDisplay" component={QuestionDisplayScreen} options={{ title: 'Interview Question', headerBackTitle: '' }} />
      <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} options={{ title: 'Feedback', headerBackTitle: '' }} />
    </Stack.Navigator>
  );
}