import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { requestAIAction } from '../aiGating';

export default function ScanScreen({ navigation }: any) {
  const { isDark } = useTheme();

  const simulateDetect = async () => {
    try {
      const gate = await requestAIAction('scan_ocr');
      if (!gate.allowed) {
        navigation.navigate('Paywall');
        return;
      }
    } catch (e) {
      console.warn('AI gate error', e);
    }

    // example detected items — in real app this comes from OCR
    const detected = [
      { name: 'Milk', quantity: 1, unit: 'ltr', category: 'Dairy', expiryDate: '' },
      { name: 'Spinach', quantity: 1, unit: 'bunch', category: 'Produce', expiryDate: '' },
    ];
    navigation.navigate('ReviewDetected', { items: detected });
  };

  const bg = isDark ? '#121212' : '#fff';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={styles.hint}>Camera placeholder (plug in ML Kit / Vision here)</Text>
      <TouchableOpacity style={styles.btn} onPress={simulateDetect}>
        <Text style={styles.btnText}>Simulate detection</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { marginTop: 12, backgroundColor: '#eee' }]}
        onPress={() => Alert.alert('Open gallery not implemented')}
      >
        <Text style={{ color: '#111' }}>Import from gallery</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 14, marginBottom: 20, textAlign: 'center' },
  btn: { backgroundColor: '#4a90e2', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '700' },
});
