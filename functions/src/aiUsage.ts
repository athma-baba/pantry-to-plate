import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const FREE_LIFETIME = Number(process.env.FREE_LIFETIME) || 10;

export async function consumeAIActionHandler(data: any, context: functions.https.CallableContext) {
  const uid = context.auth?.uid;
  if (!uid) {
    return { allowed: false, reason: 'auth' };
  }

  const action = data?.action || 'unknown';
  const db = admin.firestore();
  const userRef = db.collection('users').doc(uid);

  let result: any = { allowed: false };

  await db.runTransaction(async (tx) => {
    const doc = await tx.get(userRef);
    const user = doc.exists ? doc.data() : {};
    const entitlements = user?.entitlements || {};
    const isPro = Boolean(entitlements?.pro);
    if (isPro) {
      result = { allowed: true };
      return;
    }

    const used = user?.usage?.ai?.lifetimeUsed || 0;
    if (used < FREE_LIFETIME) {
      tx.set(
        userRef,
        {
          usage: { ai: { lifetimeUsed: used + 1, updatedAt: admin.firestore.FieldValue.serverTimestamp() } },
        },
        { merge: true }
      );
      result = { allowed: true, remaining: FREE_LIFETIME - (used + 1) };
    } else {
      result = { allowed: false, reason: 'paywall' };
    }
  });

  return result;
}
