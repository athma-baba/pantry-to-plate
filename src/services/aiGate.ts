import functions from '@react-native-firebase/functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { ENV } from './env';

const KEY_LIFETIME = 'ai:usage:lifetime';

export type AIGateResult =
  | { allowed: true; remainingFree?: number }
  | { allowed: false; reason: 'paywall' | 'auth' | 'error' };

export async function consumeAIAction(action: string): Promise<AIGateResult> {
  // Preferred path: call Cloud Function (requires user auth)
  try {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const fn = functions().httpsCallable('consumeAIAction');
      const res = await fn({ action });
      return res.data as AIGateResult;
    }
  } catch (e) {
    console.warn('consumeAIAction(functions) error', e);
    // fallthrough to local fallback
  }

  // Local fallback (client-only, not secure): lifetime-only policy
  try {
    const raw = await AsyncStorage.getItem(KEY_LIFETIME);
    const used = raw ? Number(raw) : 0;
    if (used < ENV.LIFETIME_FREE) {
      await AsyncStorage.setItem(KEY_LIFETIME, String(used + 1));
      return { allowed: true, remainingFree: ENV.LIFETIME_FREE - (used + 1) };
    }
    return { allowed: false, reason: 'paywall' };
  } catch (e) {
    console.warn('consumeAIAction(local) error', e);
    return { allowed: false, reason: 'error' };
  }
}

export async function getLocalAICounts() {
  try {
    const raw = await AsyncStorage.getItem(KEY_LIFETIME);
    const used = raw ? Number(raw) : 0;
    return { used, limit: ENV.LIFETIME_FREE };
  } catch (e) {
    return { used: 0, limit: ENV.LIFETIME_FREE };
  }
}
