import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { pantryRepository } from '../storage/pantryRepository';
import { shoppingRepository } from '../storage/shoppingRepository';
import { LocalMockRecipeService } from '../services/LocalMockRecipeService';
import { PantryItem, Recipe } from '../types';
import { useTheme } from '../context/ThemeContext';

const recipeService = new LocalMockRecipeService();
let idCounter = Date.now();
function newId() {
  return String(++idCounter);
}

export default function RecipesScreen() {
  const { isDark } = useTheme();
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    const items = await pantryRepository.getAll();
    setPantryItems(items);
    setRecipes(recipeService.suggest(items));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addToShopping = async (ingredient: string, recipeId: string) => {
    const key = `${recipeId}-${ingredient}`;
    await shoppingRepository.add({
      id: newId(),
      name: ingredient,
      checked: false,
    });
    setAdded(prev => ({ ...prev, [key]: true }));
  };

  const bg = isDark ? '#121212' : '#fff';
  const fg = isDark ? '#f0f0f0' : '#111';
  const cardBg = isDark ? '#1e1e1e' : '#f5f5f5';
  const subFg = isDark ? '#aaa' : '#555';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {pantryItems.length === 0 && (
        <Text style={[styles.hint, { color: subFg }]}>
          Add items to your pantry to get recipe suggestions!
        </Text>
      )}
      <FlatList
        data={recipes}
        keyExtractor={r => r.id}
        ListEmptyComponent={
          pantryItems.length > 0 ? (
            <Text style={[styles.empty, { color: fg }]}>No recipes found.</Text>
          ) : null
        }
        renderItem={({ item: recipe }) => (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <Text style={[styles.title, { color: fg }]}>{recipe.title}</Text>
            <Text style={[styles.desc, { color: subFg }]}>{recipe.description}</Text>

            <Text style={[styles.sectionLabel, { color: fg }]}>Ingredients:</Text>
            {recipe.ingredients.map(ing => (
              <Text key={ing} style={[styles.ingredient, { color: subFg }]}>
                • {ing}
              </Text>
            ))}

            {recipe.missingIngredients.length > 0 && (
              <>
                <Text style={[styles.sectionLabel, { color: '#e74c3c' }]}>
                  Missing — add to shopping list:
                </Text>
                {recipe.missingIngredients.map(ing => {
                  const key = `${recipe.id}-${ing}`;
                  return (
                    <View key={ing} style={styles.missingRow}>
                      <Text style={styles.missingIng}>• {ing}</Text>
                      <TouchableOpacity
                        onPress={() => addToShopping(ing, recipe.id)}
                        disabled={added[key]}>
                        <Text style={[styles.addBtn, added[key] && styles.addBtnDone]}>
                          {added[key] ? '✓ Added' : '+ Add'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  hint: { textAlign: 'center', marginBottom: 16, fontSize: 14 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, opacity: 0.6 },
  card: { borderRadius: 12, padding: 16, marginBottom: 14 },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
  desc: { fontSize: 14, marginBottom: 10 },
  sectionLabel: { fontSize: 13, fontWeight: '600', marginTop: 8, marginBottom: 4 },
  ingredient: { fontSize: 13, marginLeft: 8 },
  missingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 8, marginBottom: 2 },
  missingIng: { fontSize: 13, color: '#e74c3c' },
  addBtn: { fontSize: 13, color: '#4a90e2', fontWeight: '600' },
  addBtnDone: { color: '#27ae60' },
});
