import React from 'react';
import SettingsScreen from './SettingsScreen';

export default function ProfileScreen(props: any) {
  // Profile wraps Settings for now (diet, allergens live in settings later)
  return <SettingsScreen {...props} />;
}
