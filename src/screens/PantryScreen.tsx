import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { pantryRepository } from '../storage/pantryRepository';
import { PantryItem } from '../types';
import { useTheme } from '../context/ThemeContext';

let idCounter = Date.now();
function newId() {
  return String(++idCounter);
}

const CATEGORIES = ['Produce', 'Dairy', 'Meat', 'Grains', 'Canned', 'Spices', 'Other'];

export default function PantryScreen() {
  const { isDark } = useTheme();
  const [items, setItems] = useState<PantryItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<Partial<PantryItem>>({});

  const load = useCallback(() => {
    pantryRepository.getAll().then(setItems);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setForm({});
    setModalVisible(true);
  };

  const saveItem = async () => {
    if (!form.name?.trim()) {
      Alert.alert('Name is required');
      return;
    }
    const item: PantryItem = {
      id: form.id ?? newId(),
      name: form.name.trim(),
      quantity: Number(form.quantity) || 1,
      unit: form.unit?.trim() || 'pcs',
      category: form.category || 'Other',
      expiryDate: form.expiryDate,
    };
    if (form.id) {
      await pantryRepository.update(item);
    } else {
      await pantryRepository.add(item);
    }
    setModalVisible(false);
    load();
  };

  const deleteItem = (id: string) => {
    Alert.alert('Delete item', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await pantryRepository.remove(id);
          load();
        },
      },
    ]);
  };

  const bg = isDark ? '#121212' : '#fff';
  const fg = isDark ? '#f0f0f0' : '#111';
  const cardBg = isDark ? '#1e1e1e' : '#f5f5f5';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: fg }]}>
            No pantry items yet. Tap + to add one.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: cardBg }]}>
            <View style={styles.cardMain}>
              <Text style={[styles.itemName, { color: fg }]}>{item.name}</Text>
              <Text style={[styles.itemMeta, { color: isDark ? '#aaa' : '#555' }]}>
                {item.quantity} {item.unit} · {item.category}
                {item.expiryDate ? ` · exp ${item.expiryDate}` : ''}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                onPress={() => {
                  setForm(item);
                  setModalVisible(true);
                }}>
                <Text style={styles.actionEdit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteItem(item.id)}>
                <Text style={styles.actionDelete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: fg }]}>
              {form.id ? 'Edit Item' : 'Add Item'}
            </Text>

            <TextInput
              style={[styles.input, { color: fg, borderColor: isDark ? '#444' : '#ccc' }]}
              placeholder="Name *"
              placeholderTextColor={isDark ? '#666' : '#aaa'}
              value={form.name ?? ''}
              onChangeText={t => setForm(f => ({ ...f, name: t }))}
            />
            <TextInput
              style={[styles.input, { color: fg, borderColor: isDark ? '#444' : '#ccc' }]}
              placeholder="Quantity"
              placeholderTextColor={isDark ? '#666' : '#aaa'}
              keyboardType="numeric"
              value={String(form.quantity ?? '')}
              onChangeText={t => setForm(f => ({ ...f, quantity: Number(t) }))}
            />
            <TextInput
              style={[styles.input, { color: fg, borderColor: isDark ? '#444' : '#ccc' }]}
              placeholder="Unit (e.g. g, ml, pcs)"
              placeholderTextColor={isDark ? '#666' : '#aaa'}
              value={form.unit ?? ''}
              onChangeText={t => setForm(f => ({ ...f, unit: t }))}
            />
            <Text style={[styles.label, { color: fg }]}>Category</Text>
            <View style={styles.categories}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    form.category === cat && styles.catChipActive,
                  ]}
                  onPress={() => setForm(f => ({ ...f, category: cat }))}>
                  <Text
                    style={[
                      styles.catChipText,
                      form.category === cat && styles.catChipTextActive,
                    ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.input, { color: fg, borderColor: isDark ? '#444' : '#ccc' }]}
              placeholder="Expiry date (YYYY-MM-DD)"
              placeholderTextColor={isDark ? '#666' : '#aaa'}
              value={form.expiryDate ?? ''}
              onChangeText={t => setForm(f => ({ ...f, expiryDate: t || undefined }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={saveItem}>
                <Text style={[styles.btnText, { color: '#fff' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  cardMain: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemMeta: { fontSize: 13, marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 12 },
  actionEdit: { color: '#4a90e2', fontWeight: '600' },
  actionDelete: { color: '#e74c3c', fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4a90e2',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: { borderRadius: 14, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 15,
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  catChip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  catChipActive: { borderColor: '#4a90e2', backgroundColor: '#4a90e2' },
  catChipText: { fontSize: 13, color: '#555' },
  catChipTextActive: { color: '#fff' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  btn: { borderRadius: 8, paddingHorizontal: 18, paddingVertical: 10 },
  btnCancel: { backgroundColor: '#eee' },
  btnSave: { backgroundColor: '#4a90e2' },
  btnText: { fontWeight: '600', fontSize: 15 },
});
