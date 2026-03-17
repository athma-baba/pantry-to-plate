// src/services/env.ts
// Lightweight environment loader. Prefer react-native-config if available,
// otherwise fall back to process.env.

let Config: any = null;
try {
  // try react-native-config first
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RNConfig = require('react-native-config');
  Config = RNConfig && RNConfig.default ? RNConfig.default : RNConfig;
} catch (e) {
  Config = process.env;
}

const get = (k: string) => (Config && typeof Config[k] !== 'undefined' ? Config[k] : process.env[k]);

export const ENV = {
  APP_ENV: (get('APP_ENV') || 'staging') as 'staging' | 'production',
  REVENUECAT_API_KEY_IOS: get('REVENUECAT_API_KEY_IOS') || '',
  REVENUECAT_API_KEY_ANDROID: get('REVENUECAT_API_KEY_ANDROID') || '',
  DAILY_FREE: Number(get('DAILY_FREE') || '10'),
  LIFETIME_FREE: Number(get('LIFETIME_FREE') || '10'),
};

export default ENV;
