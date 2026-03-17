import { PantryItem, Recipe } from '../types';
import { RecipeService } from './RecipeService';

const RECIPE_TEMPLATES: Array<{
  id: string;
  title: string;
  description: string;
  ingredients: string[];
}> = [
  {
    id: 'r1',
    title: 'Veggie Stir-Fry',
    description: 'A quick and healthy stir-fry with whatever veggies you have on hand.',
    ingredients: ['carrot', 'broccoli', 'onion', 'garlic', 'soy sauce', 'oil'],
  },
  {
    id: 'r2',
    title: 'Pasta Primavera',
    description: 'Light pasta tossed with seasonal vegetables and olive oil.',
    ingredients: ['pasta', 'tomato', 'onion', 'garlic', 'olive oil', 'basil'],
  },
  {
    id: 'r3',
    title: 'Simple Egg Fried Rice',
    description: 'Classic fried rice using leftover rice, eggs, and vegetables.',
    ingredients: ['rice', 'egg', 'carrot', 'peas', 'soy sauce', 'oil'],
  },
  {
    id: 'r4',
    title: 'Tomato Soup',
    description: 'A warming tomato soup with just a handful of pantry staples.',
    ingredients: ['tomato', 'onion', 'garlic', 'vegetable broth', 'cream'],
  },
  {
    id: 'r5',
    title: 'Omelette',
    description: 'Fluffy omelette stuffed with pantry vegetables.',
    ingredients: ['egg', 'onion', 'tomato', 'cheese', 'butter'],
  },
  {
    id: 'r6',
    title: 'Bean Tacos',
    description: 'Quick tacos with canned beans and fresh toppings.',
    ingredients: ['beans', 'tortilla', 'tomato', 'onion', 'cheese', 'lime'],
  },
];

/** Deterministic mock: scores each recipe by how many ingredients are in the pantry. */
export class LocalMockRecipeService implements RecipeService {
  suggest(pantryItems: PantryItem[]): Recipe[] {
    const pantryNames = pantryItems.map(p => p.name.toLowerCase());

    const scored = RECIPE_TEMPLATES.map(template => {
      const matched = template.ingredients.filter(ing =>
        pantryNames.some(p => p.includes(ing) || ing.includes(p)),
      );
      const missing = template.ingredients.filter(
        ing => !pantryNames.some(p => p.includes(ing) || ing.includes(p)),
      );
      return {
        recipe: {
          id: template.id,
          title: template.title,
          description: template.description,
          ingredients: template.ingredients,
          missingIngredients: missing,
        } as Recipe,
        score: matched.length,
      };
    });

    // Sort descending by score (deterministic — stable sort), return top 3
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map(s => s.recipe);
  }
}
