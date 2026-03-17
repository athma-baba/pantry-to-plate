import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function OnboardingWelcome({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Pantry-to-Plate</Text>
      <Text style={styles.subtitle}>
        Quickly scan your pantry and get meal suggestions based on what you already have.
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('OnboardingDiet')}>
        <Text style={styles.btnText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  btn: { backgroundColor: '#4a90e2', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
