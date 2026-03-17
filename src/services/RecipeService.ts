import { PantryItem, Recipe } from '../types';

export interface RecipeService {
  suggest(pantryItems: PantryItem[]): Recipe[];
}
