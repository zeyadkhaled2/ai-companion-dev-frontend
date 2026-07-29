import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/Types';
export default function HomeScreen() {
  const logout = useAuthStore((state) => state.logout);
  type HomeNavProp = NativeStackNavigationProp<AppStackParamList, 'Home'>;
  const navigation = useNavigation<HomeNavProp>();
  navigation.navigate('QuestionSetup');
  return (
    <SafeAreaView>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={() => logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('QuestionSetup')}>
        <Text>Generate Question</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}