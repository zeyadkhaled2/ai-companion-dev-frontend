import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from './Types';
import HomeScreen from '../screens/HomeScreen';
import QuestionSetupScreen from '../screens/QuestionSetupScreen';
import QuestionDisplayScreen from '../screens/QuestionDisplayScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="QuestionSetup" component={QuestionSetupScreen} />
      <Stack.Screen name="QuestionDisplay" component={QuestionDisplayScreen} />
    </Stack.Navigator>
  );
}