// src/services/ocr.ts
// OCR service placeholder. Replace with ML Kit / Vision implementation.
import functions from '@react-native-firebase/functions';
import { PantryItem } from '../types';

export async function detectItemsFromImage(_imageUri?: string): Promise<Partial<PantryItem>[]> {
  try {
    const fn = functions().httpsCallable('analyzeImage');

    // If caller provided a data URL (base64), extract base64 payload.
    let imageBase64: string | undefined;
    let imageUri: string | undefined;
    if (_imageUri && _imageUri.startsWith('data:')) {
      const parts = _imageUri.split(',');
      imageBase64 = parts[1];
    } else if (_imageUri) {
      imageUri = _imageUri; // allow remote URL
    }

    const res = await fn({ imageBase64, imageUri });
    const items = (res?.data?.items || []) as Partial<PantryItem>[];
    return items;
  } catch (e) {
    console.warn('detectItemsFromImage(functions) error', e);
    // fallback to sample
    return [
      { name: 'Milk', quantity: 1, unit: 'ltr', category: 'Dairy' },
      { name: 'Spinach', quantity: 1, unit: 'bunch', category: 'Produce' },
    ];
  }
}

export default { detectItemsFromImage };
