import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { consumeAIActionHandler } from './aiUsage';
import { revenueCatWebhookHandler } from './revenuecatWebhook';

admin.initializeApp();

export const consumeAIAction = functions.https.onCall(async (data, context) => {
  return await consumeAIActionHandler(data, context);
});

export const revenueCatWebhook = functions.https.onRequest(revenueCatWebhookHandler);
