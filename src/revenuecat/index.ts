// src/revenuecat/index.ts
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { ENV } from '../services/env';

export const ENTITLEMENT_ID = 'pro';

export async function initRevenueCat(): Promise<void> {
  try {
    const apiKey = Platform.OS === 'ios' ? ENV.REVENUECAT_API_KEY_IOS : ENV.REVENUECAT_API_KEY_ANDROID;
    if (!apiKey) {
      console.warn('RevenueCat API key not set for platform', Platform.OS);
      return;
    }
    // react-native-purchases v7+ uses `setup`
    // use dynamic access to avoid hard TS coupling to a specific RN-Purchases version
    // @ts-ignore
    if (typeof Purchases.setup === 'function') {
      // @ts-ignore
      await Purchases.setup(apiKey);
      return;
    }
    // fallback: some versions expose `configure`
    // @ts-ignore
    if (typeof Purchases.configure === 'function') {
      // @ts-ignore
      Purchases.configure({ apiKey });
      return;
    }
  } catch (e) {
    console.warn('initRevenueCat error:', e);
  }
}

export async function getOfferings(): Promise<any | null> {
  try {
    // @ts-ignore
    return await Purchases.getOfferings?.();
  } catch (e) {
    console.warn('getOfferings error:', e);
    return null;
  }
}

export async function purchasePackage(pkg: any): Promise<any> {
  // @ts-ignore
  return await Purchases.purchasePackage?.(pkg);
}

export async function restorePurchases(): Promise<any> {
  // @ts-ignore
  return await Purchases.restorePurchases?.();
}

export async function getCustomerInfo(): Promise<any | null> {
  try {
    // @ts-ignore
    return await Purchases.getCustomerInfo?.();
  } catch (e) {
    console.warn('getCustomerInfo', e);
    return null;
  }
}

export function addCustomerInfoListener(cb: (info: any) => void): (() => void) {
  try {
    // @ts-ignore
    const remove = Purchases.addCustomerInfoUpdateListener?.(cb);
    return typeof remove === 'function' ? remove : () => {};
  } catch (e) {
    return () => {};
  }
}

export async function isProActive(): Promise<boolean> {
  try {
    const info = await getCustomerInfo();
    const ent = info?.entitlements?.active;
    return !!(ent && ent[ENTITLEMENT_ID]);
  } catch (e) {
    return false;
  }
}
