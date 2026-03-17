// src/services/ocr.ts
// OCR service placeholder. Replace with ML Kit / Vision implementation.
import { PantryItem } from '../types';

export async function detectItemsFromImage(_imageUri?: string): Promise<Partial<PantryItem>[]> {
  // TODO: integrate with on-device ML Kit or cloud OCR.
  // Example libraries: react-native-vision-camera + vision-camera-mlkit, or
  // @react-native-ml-kit/text-recognition. For now return a small sample.
  return [
    { name: 'Milk', quantity: 1, unit: 'ltr', category: 'Dairy' },
    { name: 'Spinach', quantity: 1, unit: 'bunch', category: 'Produce' },
  ];
}

export default { detectItemsFromImage };
