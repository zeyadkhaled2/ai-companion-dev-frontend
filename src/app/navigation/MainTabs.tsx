import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../features/home/screens/HomeScreen';
import HistoryScreen from '../../features/progress/screens/HistoryScreen';
import AccountScreen from '../../features/account/screens/AccountScreen';
import CustomTabBar from './CustomTabBar';
import DashboardScreen from '../../features/progress/screens/DashboardScreen';
import ChatScreen from '../../features/chat/screens/ChatScreen';

export type MainTabsParamList = {
  History: undefined;
  Dashboard: undefined;
  Home: undefined;
  Chat: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
