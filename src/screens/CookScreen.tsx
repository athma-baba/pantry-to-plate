import React from 'react';
import RecipesScreen from './RecipesScreen';

export default function CookScreen(props: any) {
  // Cook hub - reuse RecipesScreen for MVP
  return <RecipesScreen {...props} />;
}
