import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { preferencesRepository } from '../storage/preferencesRepository';

const DIETS = ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Halal'];

export default function OnboardingDietAllergens({ navigation }: any) {
  const [diet, setDiet] = useState<string>('Omnivore');
  const [allergensText, setAllergensText] = useState<string>('');

  const saveAndFinish = async () => {
    const allergens = allergensText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    await preferencesRepository.save({ diet, allergens, onboarded: true });
    navigation.reset({ index: 0, routes: [{ name: 'App' }] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tell us about your diet</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
        {DIETS.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, diet === d && styles.chipActive]}
            onPress={() => setDiet(d)}>
            <Text style={[styles.chipText, diet === d && styles.chipTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Allergens (comma separated)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. peanuts, shellfish"
        value={allergensText}
        onChangeText={setAllergensText}
      />

      <TouchableOpacity style={styles.btn} onPress={saveAndFinish}>
        <Text style={styles.btnText}>Finish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: '#4a90e2', borderColor: '#4a90e2' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#fff' },
  label: { marginBottom: 6, marginTop: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 16 },
  btn: { backgroundColor: '#4a90e2', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
