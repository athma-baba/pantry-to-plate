import AsyncStorage from '@react-native-async-storage/async-storage';
import { Preferences } from '../types';

const PREFS_KEY = '@preferences';

const defaults: Preferences = { theme: 'light', units: 'metric' };

export const preferencesRepository = {
  async get(): Promise<Preferences> {
    try {
      const json = await AsyncStorage.getItem(PREFS_KEY);
      return json ? (JSON.parse(json) as Preferences) : { ...defaults };
    } catch {
      return { ...defaults };
    }
  },

  async save(prefs: Preferences): Promise<void> {
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(PREFS_KEY);
  },
};
