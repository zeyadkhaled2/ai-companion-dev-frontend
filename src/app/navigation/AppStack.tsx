import OutputChallengeScreen from '../../features/output/screens/OutputChallengeScreen';
import QueueLessonScreen from '../../features/lab/QueueLessonScreen';
import LabScreen from '../../features/lab/LabScreen';
import RecursionLessonScreen from '../../features/lab/RecursionLessonScreen';
import TreeTraversalScreen from '../../features/lab/TreeTraversalScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './types';
import MainTabs from './MainTabs';
import QuestionSetupScreen from '../../features/practice/screens/QuestionSetupScreen';
import QuestionDisplayScreen from '../../features/practice/screens/QuestionDisplayScreen';
import FeedbackScreen from '../../features/practice/screens/FeedbackScreen';
import { useTheme } from '../../shared/hooks/useTheme';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerShadowVisible: false,
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="Tabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="DataStructuresLab"
        component={LabScreen}
        options={{ title: 'Data Structures Lab', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="QueueLesson"
        component={QueueLessonScreen}
        options={{ title: 'Queues', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="RecursionLesson"
        component={RecursionLessonScreen}
        options={{ title: 'Recursion Lab', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="TreeTraversal"
        component={TreeTraversalScreen}
        options={{ title: 'Tree Traversal', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="QuestionSetup"
        component={QuestionSetupScreen}
        options={{ title: 'New Question', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="OutputChallenge"
        component={OutputChallengeScreen}
        options={{ title: 'Predict the output', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="QuestionDisplay"
        component={QuestionDisplayScreen}
        options={{ title: 'Interview Question', headerBackTitle: '' }}
      />
      <Stack.Screen
        name="FeedbackScreen"
        component={FeedbackScreen}
        options={{ title: 'Feedback', headerBackTitle: '' }}
      />
    </Stack.Navigator>
  );
}
