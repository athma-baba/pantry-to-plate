import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import PantryScreen from '../screens/PantryScreen';
import RecipesScreen from '../screens/RecipesScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import CookScreen from '../screens/CookScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReviewDetectedScreen from '../screens/ReviewDetectedScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Scan: '📷',
    Cook: '🍳',
    Pantry: '🥦',
    Profile: '👤',
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[label] ?? '•'}</Text>
  );
}

function MainTabs() {
  const { isDark } = useTheme();

  const tabBarStyle = {
    backgroundColor: isDark ? '#1a1a1a' : '#fff',
    borderTopColor: isDark ? '#333' : '#e0e0e0',
  };
  const activeTint = '#4a90e2';
  const inactiveTint = isDark ? '#666' : '#999';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarStyle,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        headerStyle: { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
        headerTintColor: isDark ? '#f0f0f0' : '#111',
        headerTitleStyle: { fontWeight: '700' },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Cook" component={CookScreen} />
      <Tab.Screen name="Pantry" component={PantryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ReviewDetected" component={ReviewDetectedScreen} options={{ title: 'Confirm items' }} />
    </Stack.Navigator>
  );
}
