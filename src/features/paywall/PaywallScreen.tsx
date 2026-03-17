import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useSubscription } from '../../store/SubscriptionProvider';

export default function PaywallScreen({ navigation }: any) {
  const { offerings, purchase, restore } = useSubscription();

  const handlePurchase = async () => {
    try {
      // prefer monthly then annual then first available
      const pkg = offerings?.current?.monthly || offerings?.current?.annual || offerings?.all?.[0]?.monthly || null;
      if (!pkg) return Alert.alert('No offerings available');
      await purchase(pkg);
    } catch (e) {
      Alert.alert('Purchase failed', String(e));
    }
  };

  const handleRestore = async () => {
    try {
      await restore();
      Alert.alert('Restored purchases');
    } catch (e) {
      Alert.alert('Restore failed', String(e));
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>Unlock Pro</Text>
      <Text style={{ marginBottom: 16 }}>Pro unlocks OCR, AI recipe generation, substitutions and higher limits.</Text>
      <Button title="Subscribe / Purchase" onPress={handlePurchase} />
      <View style={{ height: 12 }} />
      <Button title="Restore purchases" onPress={handleRestore} />
    </View>
  );
}
