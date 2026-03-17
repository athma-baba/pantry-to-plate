import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { requestAIAction } from '../aiGating';
import { pantryRepository } from '../storage/pantryRepository';
import { LocalMockRecipeService } from '../services/LocalMockRecipeService';
import { PantryItem, Recipe } from '../types';

const recipeService = new LocalMockRecipeService();

export default function HomeScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const load = useCallback(async () => {
    const items = await pantryRepository.getAll();
    setPantryItems(items);
    setRecipes(recipeService.suggest(items));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bg = isDark ? '#121212' : '#fff';
  const fg = isDark ? '#f0f0f0' : '#111';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: fg }]}>Good evening</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Scan')} style={styles.scanBtn}>
          <Text style={styles.scanText}>Scan now</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: fg }]}>Use-it-up</Text>
      <FlatList
        horizontal
        data={recipes}
        keyExtractor={r => r.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={async () => {
              try {
                const gate = await requestAIAction('recipe_generate');
                if (!gate.allowed) {
                  navigation.navigate('Paywall');
                  return;
                }
              } catch (e) {
                console.warn('AI gate error', e);
              }
              navigation.navigate('Cook', { recipeId: item.id });
            }}
            style={[styles.card, { borderColor: '#e0e0e0' }]}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>{item.missingIngredients.length === 0 ? 'Have all' : `Missing ${item.missingIngredients.length}`}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={[styles.sectionTitle, { color: fg, marginTop: 16 }]}>Meals you can make now</Text>
      <FlatList
        data={recipes}
        keyExtractor={r => r.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: fg }]}>{item.title}</Text>
              <Text style={[styles.desc, { color: isDark ? '#aaa' : '#666' }]}>{item.description}</Text>
            </View>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const gate = await requestAIAction('recipe_generate');
                  if (!gate.allowed) {
                    navigation.navigate('Paywall');
                    return;
                  }
                } catch (e) {
                  console.warn('AI gate error', e);
                }
                navigation.navigate('Cook', { recipeId: item.id });
              }}>
              <Text style={{ color: '#4a90e2' }}>Cook</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  greeting: { fontSize: 20, fontWeight: '700' },
  scanBtn: { backgroundColor: '#4a90e2', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  scanText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  card: { width: 160, height: 90, borderRadius: 12, padding: 12, marginRight: 10, justifyContent: 'center' },
  cardTitle: { fontWeight: '700', marginBottom: 6 },
  cardMeta: { fontSize: 12, color: '#666' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  title: { fontWeight: '700' },
  desc: { fontSize: 13 },
});
