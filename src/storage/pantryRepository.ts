import AsyncStorage from '@react-native-async-storage/async-storage';
import { PantryItem } from '../types';

const PANTRY_KEY = '@pantry_items';

export const pantryRepository = {
  async getAll(): Promise<PantryItem[]> {
    try {
      const json = await AsyncStorage.getItem(PANTRY_KEY);
      return json ? (JSON.parse(json) as PantryItem[]) : [];
    } catch {
      return [];
    }
  },

  async save(items: PantryItem[]): Promise<void> {
    await AsyncStorage.setItem(PANTRY_KEY, JSON.stringify(items));
  },

  async add(item: PantryItem): Promise<void> {
    const items = await this.getAll();
    items.push(item);
    await this.save(items);
  },

  async update(updated: PantryItem): Promise<void> {
    const items = await this.getAll();
    const idx = items.findIndex(i => i.id === updated.id);
    if (idx !== -1) {
      items[idx] = updated;
      await this.save(items);
    }
  },

  async remove(id: string): Promise<void> {
    const items = await this.getAll();
    await this.save(items.filter(i => i.id !== id));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(PANTRY_KEY);
  },
};
