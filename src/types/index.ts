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
  onboarded?: boolean;
  diet?: string; // e.g. 'vegetarian', 'vegan', 'omnivore'
  allergens?: string[];
  dislikes?: string[];
  timePref?: number; // preferred max cook time in minutes
  appliances?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  missingIngredients: string[];
}
