import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  initRevenueCat,
  getOfferings,
  purchasePackage,
  restorePurchases,
  addCustomerInfoListener,
  getCustomerInfo,
} from '../revenuecat';

type SubscriptionContextType = {
  isPro: boolean;
  offerings: any | null;
  purchase: (pkg: any) => Promise<any>;
  restore: () => Promise<any>;
  loading: boolean;
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPro: false,
  offerings: null,
  purchase: async () => null,
  restore: async () => null,
  loading: true,
});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [offerings, setOfferings] = useState<any | null>(null);

  useEffect(() => {
    let removeListener = () => {};
    (async () => {
      try {
        await initRevenueCat();
        const o = await getOfferings();
        setOfferings(o);
        const info = await getCustomerInfo();
        setIsPro(Boolean(info?.entitlements?.active?.pro));
        removeListener = addCustomerInfoListener((newInfo: any) => {
          setIsPro(Boolean(newInfo?.entitlements?.active?.pro));
        });
      } catch (e) {
        console.warn('SubscriptionProvider init error', e);
      } finally {
        setLoading(false);
      }
    })();

    return () => removeListener();
  }, []);

  const purchase = async (pkg: any) => {
    return await purchasePackage(pkg);
  };

  const restore = async () => {
    return await restorePurchases();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SubscriptionContext.Provider value={{ isPro, offerings, purchase, restore, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
