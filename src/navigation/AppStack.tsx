import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './Types';
import HomeScreen from '../screens/HomeScreen';
import QuestionSetupScreen from '../screens/QuestionSetupScreen';
import QuestionDisplayScreen from '../screens/QuestionDisplayScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="QuestionSetup" component={QuestionSetupScreen} options={{ title: 'New Question' }} />
      <Stack.Screen name="QuestionDisplay" component={QuestionDisplayScreen} options={{ title: 'Interview Question' }} />
    </Stack.Navigator>
  );
}