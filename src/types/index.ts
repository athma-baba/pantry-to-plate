export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate?: string; // ISO date string, optional
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  checked: boolean;
}

export interface Preferences {
  theme: 'light' | 'dark';
  units: 'metric' | 'imperial';
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  missingIngredients: string[];
}
