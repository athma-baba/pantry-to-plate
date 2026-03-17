import React from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { isDark, preferences, toggleTheme, toggleUnits, resetAll } = useTheme();

  const bg = isDark ? '#121212' : '#fff';
  const fg = isDark ? '#f0f0f0' : '#111';
  const rowBg = isDark ? '#1e1e1e' : '#f5f5f5';
  const subFg = isDark ? '#aaa' : '#555';

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will clear your pantry, shopping list, and all preferences. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetAll(),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={[styles.sectionTitle, { color: subFg }]}>APPEARANCE</Text>
      <View style={[styles.row, { backgroundColor: rowBg }]}>
        <View>
          <Text style={[styles.rowLabel, { color: fg }]}>Dark Mode</Text>
          <Text style={[styles.rowSub, { color: subFg }]}>
            Currently: {preferences.theme === 'dark' ? 'Dark' : 'Light'}
          </Text>
        </View>
        <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: '#4a90e2' }} />
      </View>

      <Text style={[styles.sectionTitle, { color: subFg, marginTop: 24 }]}>UNITS</Text>
      <View style={[styles.row, { backgroundColor: rowBg }]}>
        <View>
          <Text style={[styles.rowLabel, { color: fg }]}>Use Metric Units</Text>
          <Text style={[styles.rowSub, { color: subFg }]}>
            Currently: {preferences.units === 'metric' ? 'Metric (g, ml)' : 'Imperial (oz, fl oz)'}
          </Text>
        </View>
        <Switch
          value={preferences.units === 'metric'}
          onValueChange={toggleUnits}
          trackColor={{ true: '#4a90e2' }}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: subFg, marginTop: 24 }]}>DATA</Text>
      <TouchableOpacity
        style={[styles.resetBtn, { backgroundColor: rowBg }]}
        onPress={handleReset}>
        <Text style={styles.resetBtnText}>⚠️  Reset All Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
  },
  rowLabel: { fontSize: 16, fontWeight: '500' },
  rowSub: { fontSize: 13, marginTop: 2 },
  resetBtn: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resetBtnText: { color: '#e74c3c', fontSize: 16, fontWeight: '600' },
});
