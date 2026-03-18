import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { requestAIAction } from '../aiGating';
import { detectItemsFromImage } from '../services/ocr';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

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

    // In a real app we would capture an image and pass the URI here to an OCR
    // implementation (ML Kit / Vision). For now, call the stubbed OCR service.
    try {
      const detected = await detectItemsFromImage();
      navigation.navigate('ReviewDetected', { items: detected });
    } catch (e) {
      console.warn('OCR detect error', e);
      Alert.alert('OCR error', 'Could not detect items');
    }
  };

  const openGallery = async () => {
    try {
      const gate = await requestAIAction('scan_ocr');
      if (!gate.allowed) {
        navigation.navigate('Paywall');
        return;
      }
    } catch (e) {
      console.warn('AI gate error', e);
    }

    try {
      const res = await launchImageLibrary({ mediaType: 'photo', includeBase64: true, quality: 0.8 });
      if (res.didCancel) return;
      if (res.errorCode) {
        Alert.alert('Image picker error', res.errorMessage || 'Unknown error');
        return;
      }
      const asset = res.assets && res.assets[0];
      if (!asset) return;
      const base64 = asset.base64;
      const dataUrl = base64 ? `data:${asset.type};base64,${base64}` : asset.uri;
      const detected = await detectItemsFromImage(dataUrl as string);
      navigation.navigate('ReviewDetected', { items: detected });
    } catch (e) {
      console.warn('Gallery import error', e);
      Alert.alert('Import error', 'Could not import image');
    }
  };

  const takePhoto = async () => {
    try {
      const gate = await requestAIAction('scan_ocr');
      if (!gate.allowed) {
        navigation.navigate('Paywall');
        return;
      }
    } catch (e) {
      console.warn('AI gate error', e);
    }

    try {
      const res = await launchCamera({ mediaType: 'photo', includeBase64: true, quality: 0.8 });
      if (res.didCancel) return;
      if (res.errorCode) {
        Alert.alert('Camera error', res.errorMessage || 'Unknown error');
        return;
      }
      const asset = res.assets && res.assets[0];
      if (!asset) return;
      const base64 = asset.base64;
      const dataUrl = base64 ? `data:${asset.type};base64,${base64}` : asset.uri;
      const detected = await detectItemsFromImage(dataUrl as string);
      navigation.navigate('ReviewDetected', { items: detected });
    } catch (e) {
      console.warn('Camera error', e);
      Alert.alert('Camera error', 'Could not capture photo');
    }
  };

  const bg = isDark ? '#121212' : '#fff';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Text style={styles.hint}>Camera placeholder (plug in ML Kit / Vision here)</Text>
      <TouchableOpacity style={styles.btn} onPress={simulateDetect}>
        <Text style={styles.btnText}>Simulate detection</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { marginTop: 12, backgroundColor: '#eee' }]} onPress={openGallery}>
        <Text style={{ color: '#111' }}>Import from gallery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { marginTop: 12, backgroundColor: '#eee' }]} onPress={takePhoto}>
        <Text style={{ color: '#111' }}>Take photo</Text>
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
