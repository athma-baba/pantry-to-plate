import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Preferences } from '../types';
import { preferencesRepository } from '../storage/preferencesRepository';

interface ThemeContextValue {
  preferences: Preferences;
  toggleTheme: () => void;
  toggleUnits: () => void;
  resetAll: () => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  preferences: { theme: 'light', units: 'metric' },
  toggleTheme: () => {},
  toggleUnits: () => {},
  resetAll: async () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>({ theme: 'light', units: 'metric' });

  useEffect(() => {
    preferencesRepository.get().then(setPreferences);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreferences(prev => {
      const next: Preferences = { ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' };
      preferencesRepository.save(next);
      return next;
    });
  }, []);

  const toggleUnits = useCallback(() => {
    setPreferences(prev => {
      const next: Preferences = {
        ...prev,
        units: prev.units === 'metric' ? 'imperial' : 'metric',
      };
      preferencesRepository.save(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(async () => {
    const { pantryRepository } = await import('../storage/pantryRepository');
    const { shoppingRepository } = await import('../storage/shoppingRepository');
    await Promise.all([
      pantryRepository.clear(),
      shoppingRepository.clear(),
      preferencesRepository.clear(),
    ]);
    setPreferences({ theme: 'light', units: 'metric' });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preferences, toggleTheme, toggleUnits, resetAll, isDark: preferences.theme === 'dark' }),
    [preferences, toggleTheme, toggleUnits, resetAll],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
