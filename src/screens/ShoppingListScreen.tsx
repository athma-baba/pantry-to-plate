import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { shoppingRepository } from '../storage/shoppingRepository';
import { ShoppingItem } from '../types';
import { useTheme } from '../context/ThemeContext';

export default function ShoppingListScreen() {
  const { isDark } = useTheme();
  const [items, setItems] = useState<ShoppingItem[]>([]);

  const load = useCallback(() => {
    shoppingRepository.getAll().then(setItems);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (id: string) => {
    await shoppingRepository.toggle(id);
    load();
  };

  const remove = async (id: string) => {
    await shoppingRepository.remove(id);
    load();
  };

  const bg = isDark ? '#121212' : '#fff';
  const fg = isDark ? '#f0f0f0' : '#111';
  const cardBg = isDark ? '#1e1e1e' : '#f5f5f5';

  const pending = items.filter(i => !i.checked);
  const done = items.filter(i => i.checked);

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <TouchableOpacity style={styles.check} onPress={() => toggle(item.id)}>
        <View
          style={[
            styles.checkbox,
            item.checked && styles.checkboxChecked,
          ]}
        >
          {item.checked && <Text style={styles.checkMark}>✓</Text>}
        </View>
      </TouchableOpacity>
      <Text
        style={[
          styles.itemName,
          { color: fg },
          item.checked && styles.itemChecked,
        ]}>
        {item.name}
        {item.quantity ? ` (${item.quantity}${item.unit ? ' ' + item.unit : ''})` : ''}
      </Text>
      <TouchableOpacity onPress={() => remove(item.id)}>
        <Text style={styles.removeBtn}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {items.length === 0 && (
        <Text style={[styles.empty, { color: fg }]}>
          Shopping list is empty. Add items from the Recipes screen!
        </Text>
      )}
      <FlatList
        data={[...pending, ...done]}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListFooterComponent={
          done.length > 0 ? (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={async () => {
                await Promise.all(done.map(i => shoppingRepository.remove(i.id)));
                load();
              }}>
              <Text style={styles.clearBtnText}>Clear completed ({done.length})</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, opacity: 0.6 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  check: { padding: 4 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4a90e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#27ae60', borderColor: '#27ae60' },
  checkMark: { color: '#fff', fontSize: 13, fontWeight: '700' },
  itemName: { flex: 1, fontSize: 16 },
  itemChecked: { textDecorationLine: 'line-through', opacity: 0.5 },
  removeBtn: { color: '#e74c3c', fontSize: 18, fontWeight: '600' },
  clearBtn: {
    marginTop: 10,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  clearBtnText: { color: '#e74c3c', fontWeight: '600' },
});
