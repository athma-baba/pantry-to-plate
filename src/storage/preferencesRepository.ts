import AsyncStorage from '@react-native-async-storage/async-storage';
import { Preferences } from '../types';

const PREFS_KEY = '@preferences';

const defaults: Preferences = {
  theme: 'light',
  units: 'metric',
  onboarded: false,
  diet: '',
  allergens: [],
  dislikes: [],
  timePref: 20,
  appliances: [],
};

export const preferencesRepository = {
  async get(): Promise<Preferences> {
    try {
      const json = await AsyncStorage.getItem(PREFS_KEY);
      return json ? (JSON.parse(json) as Preferences) : { ...defaults };
    } catch {
      return { ...defaults };
    }
  },

  async save(prefs: Partial<Preferences>): Promise<void> {
    const curr = await this.get();
    const merged = { ...curr, ...prefs } as Preferences;
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(merged));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(PREFS_KEY);
  },
};
