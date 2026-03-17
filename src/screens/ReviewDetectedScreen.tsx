import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { PantryItem } from '../types';
import { pantryRepository } from '../storage/pantryRepository';

export default function ReviewDetectedScreen({ route, navigation }: any) {
  const initial: Partial<PantryItem>[] = route.params?.items || [];
  const [items, setItems] = useState<Partial<PantryItem>[]>(initial);

  const updateItem = (idx: number, patch: Partial<PantryItem>) => {
    setItems(prev => prev.map((it, i) => (i === idx ? { ...(it || {}), ...patch } : it)));
  };

  const saveAll = async () => {
    try {
      for (const it of items) {
        if (!it.name) continue;
        const pantryItem: PantryItem = {
          id: String(Date.now()) + Math.random().toString(36).slice(2, 7),
          name: (it.name || '').trim(),
          quantity: Number(it.quantity) || 1,
          unit: it.unit || 'pcs',
          category: it.category || 'Other',
          expiryDate: it.expiryDate || undefined,
        };
        await pantryRepository.add(pantryItem);
      }
      Alert.alert('Saved', 'Items added to pantry');
      navigation.navigate('Pantry');
    } catch (e) {
      Alert.alert('Error', 'Could not save items');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm detected items</Text>
      <FlatList
        data={items}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              value={item.name}
              onChangeText={t => updateItem(index, { name: t })}
              placeholder="Item name"
            />
            <TextInput
              style={[styles.input, { width: 80 }]}
              value={String(item.quantity || '')}
              onChangeText={t => updateItem(index, { quantity: Number(t) })}
              keyboardType="numeric"
              placeholder="Qty"
            />
          </View>
        )}
      />
      <View style={{ height: 12 }} />
      <TouchableOpacity style={styles.saveBtn} onPress={saveAll}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Save to Pantry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginRight: 8 },
  saveBtn: { backgroundColor: '#4a90e2', padding: 14, borderRadius: 10, alignItems: 'center' },
});
