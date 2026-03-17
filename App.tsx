/**
 * Pantry to Plate
 * MVP v1: tabs + storage + mock recipes + shopping list + settings
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { SubscriptionProvider } from './src/store/SubscriptionProvider';
import { preferencesRepository } from './src/storage/preferencesRepository';
import OnboardingWelcome from './src/screens/OnboardingWelcome';
import OnboardingDietAllergens from './src/screens/OnboardingDietAllergens';

const RootStack = createNativeStackNavigator();

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
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    (async () => {
      const prefs = await preferencesRepository.get();
      setShowOnboarding(!prefs.onboarded);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </SafeAreaProvider>
    );
  }

  const initialRoute = showOnboarding ? 'OnboardingWelcome' : 'App';

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SubscriptionProvider>
          <NavigationContainer>
            <RootStack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
              <RootStack.Screen name="OnboardingWelcome" component={OnboardingWelcome} />
              <RootStack.Screen name="OnboardingDiet" component={OnboardingDietAllergens} />
              <RootStack.Screen name="App" component={Inner} />
            </RootStack.Navigator>
          </NavigationContainer>
        </SubscriptionProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
