import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import PantryScreen from '../screens/PantryScreen';
import RecipesScreen from '../screens/RecipesScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Pantry: '🥦',
    Recipes: '🍳',
    'Shopping List': '🛒',
    Settings: '⚙️',
  };
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icons[label] ?? '•'}</Text>
  );
}

export default function AppNavigator() {
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
      <Tab.Screen name="Pantry" component={PantryScreen} />
      <Tab.Screen name="Recipes" component={RecipesScreen} />
      <Tab.Screen name="Shopping List" component={ShoppingListScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
