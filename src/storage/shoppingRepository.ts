import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingItem } from '../types';

const SHOPPING_KEY = '@shopping_items';

export const shoppingRepository = {
  async getAll(): Promise<ShoppingItem[]> {
    try {
      const json = await AsyncStorage.getItem(SHOPPING_KEY);
      return json ? (JSON.parse(json) as ShoppingItem[]) : [];
    } catch {
      return [];
    }
  },

  async save(items: ShoppingItem[]): Promise<void> {
    await AsyncStorage.setItem(SHOPPING_KEY, JSON.stringify(items));
  },

  async add(item: ShoppingItem): Promise<void> {
    const items = await this.getAll();
    // avoid duplicates by name
    if (!items.find(i => i.name.toLowerCase() === item.name.toLowerCase())) {
      items.push(item);
      await this.save(items);
    }
  },

  async toggle(id: string): Promise<void> {
    const items = await this.getAll();
    const idx = items.findIndex(i => i.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], checked: !items[idx].checked };
      await this.save(items);
    }
  },

  async remove(id: string): Promise<void> {
    const items = await this.getAll();
    await this.save(items.filter(i => i.id !== id));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(SHOPPING_KEY);
  },
};
