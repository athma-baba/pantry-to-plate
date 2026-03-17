# Pantry to Plate 🥘

A React Native app that helps you manage your pantry, discover recipes based on what you have, and maintain a shopping list — with offline-first local storage.

---

## Features (MVP v1)

| Feature | Details |
|---|---|
| **Pantry Management** | Add, edit, delete items with name, quantity, unit, category, optional expiry date |
| **Recipe Suggestions** | Deterministic mock AI suggests 3 recipes scored by pantry matches |
| **Shopping List** | Add missing recipe ingredients directly; mark complete; remove |
| **Settings** | Light/Dark theme toggle, metric/imperial unit preference, reset all data |
| **Offline-First** | All data persisted locally via AsyncStorage; no backend required |

---

## Project Structure

```
src/
├── context/          # ThemeProvider (theme + units preferences via Context)
├── navigation/       # Bottom tab navigator (Pantry · Recipes · Shopping List · Settings)
├── screens/          # PantryScreen, RecipesScreen, ShoppingListScreen, SettingsScreen
├── services/         # RecipeService interface + LocalMockRecipeService implementation
├── storage/          # AsyncStorage typed repositories (pantry, shopping, preferences)
└── types/            # Shared TypeScript interfaces (PantryItem, ShoppingItem, Preferences, Recipe)
```

### Data Layer

All data is stored on-device using `@react-native-async-storage/async-storage` with three separate repositories:

| Repository | Key | Description |
|---|---|---|
| `pantryRepository` | `@pantry_items` | CRUD for pantry items |
| `shoppingRepository` | `@shopping_items` | Shopping list with toggle/remove |
| `preferencesRepository` | `@preferences` | Theme + units settings |

---

## Getting Started

> **Prerequisite:** Complete the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment) for your target platform.

### 1. Install dependencies

```sh
npm install
```

### 2. Start Metro

```sh
npm start
```

### 3. Run on iOS

Install CocoaPods (first time only):

```sh
bundle install
bundle exec pod install
```

Then run:

```sh
npm run ios
```

### 4. Run on Android

```sh
npm run android
```

### 5. Lint & Format

```sh
# Lint (ESLint)
npm run lint

# Format (Prettier)
npm run format
```

---

## Development Notes

- **TypeScript** — strict typings across all modules (`src/types/index.ts`)
- **ESLint** — config in `.eslintrc.js` (extends `@react-native`)
- **Prettier** — config in `.prettierrc.js`
- **Jest** — existing tests in `__tests__/`
- **Navigation** — `@react-navigation/native` v7 + bottom tabs
- **Recipe engine** — `LocalMockRecipeService` scores templates by pantry matches (no network calls)
