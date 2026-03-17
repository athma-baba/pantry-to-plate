import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { consumeAIActionHandler } from './aiUsage';

admin.initializeApp();

export const consumeAIAction = functions.https.onCall(async (data, context) => {
  return await consumeAIActionHandler(data, context);
});

// Placeholder endpoint for RevenueCat webhook sync. Configure dashboard to POST here.
export const revenueCatWebhook = functions.https.onRequest(async (req, res) => {
  try {
    // In production verify signature and parse payload
    console.log('RevenueCat webhook received', req.method, req.path);
    // TODO: parse event and write entitlements into users/{uid}
    res.status(200).send('ok');
  } catch (e) {
    console.error('webhook error', e);
    res.status(500).send('error');
  }
});
