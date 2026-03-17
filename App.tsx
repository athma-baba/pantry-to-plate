/**
 * Pantry to Plate
 * MVP v1: tabs + storage + mock recipes + shopping list + settings
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { SubscriptionProvider } from './src/store/SubscriptionProvider';

function Inner() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SubscriptionProvider>
          <NavigationContainer>
            <Inner />
          </NavigationContainer>
        </SubscriptionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
