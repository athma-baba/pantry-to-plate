import * as admin from 'firebase-admin';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as functions from 'firebase-functions';

/**
 * RevenueCat webhook handler (MVP)
 * - Parses webhook payload and writes `entitlements` into users/{appUserId}
 * - In production verify signature header (X-REVENUECAT-SIGNATURE) before trusting payload
 * - Map `appUserId` to your Firebase uid (here we assume the app uses the same appUserId)
 */
export async function revenueCatWebhookHandler(req: Request, res: Response) {
  try {
    const body = req.body || {};
    const data = body.data || body;

    // Verify signature if a secret is configured. The secret can be provided via
    // environment variable `REVENUECAT_WEBHOOK_SECRET` or using
    // `firebase functions:config:set revenuecat.webhook_secret="..."`.
    const configuredSecret = process.env.REVENUECAT_WEBHOOK_SECRET || (functions as any).config?.()?.revenuecat?.webhook_secret || (functions as any).config?.().revenuecat?.webhook_secret;
    if (configuredSecret) {
      const header = (req.get('X-REVENUECAT-SIGNATURE') || req.get('x-revenuecat-signature') || '') as string;
      const sig = header.trim();

      if (!sig) {
        console.warn('revenueCatWebhook: missing signature header');
        res.status(401).send('missing-signature');
        return;
      }

      // rawBody is available in Cloud Functions; fall back to stringified body.
      const raw = (req as any).rawBody ?? Buffer.from(JSON.stringify(req.body || {}));

      const computedHex = crypto.createHmac('sha256', configuredSecret).update(raw).digest('hex');
      const computedBase64 = crypto.createHmac('sha256', configuredSecret).update(raw).digest('base64');

      // Normalize header by removing common prefix like `sha256=` if present
      const normalized = sig.replace(/^sha256=/i, '');

      let valid = false;
      try {
        if (/^[0-9a-f]{64}$/i.test(normalized)) {
          const a = Buffer.from(computedHex, 'hex');
          const b = Buffer.from(normalized, 'hex');
          if (a.length === b.length && crypto.timingSafeEqual(a, b)) valid = true;
        } else {
          const a = Buffer.from(computedBase64, 'base64');
          const b = Buffer.from(normalized, 'base64');
          if (a.length === b.length && crypto.timingSafeEqual(a, b)) valid = true;
        }
      } catch (e) {
        // If parsing fails, fall through to reject
      }

      if (!valid) {
        console.warn('revenueCatWebhook: signature mismatch', { sig, computedHex });
        res.status(401).send('signature-mismatch');
        return;
      }
    }

    // Try common fields where RevenueCat puts the app user id
    const appUserId = data?.app_user_id || data?.appUserId || data?.subscriber?.original_app_user_id || data?.subscriber?.app_user_id || data?.subscriber?.appUserId;

    const entitlements = data?.subscriber?.entitlements || {};

    if (!appUserId) {
      console.warn('revenueCatWebhook: no appUserId in payload', body);
      // still ack
      res.status(200).send('no-app-user-id');
      return;
    }

    // Write entitlements into Firestore under users/{appUserId}
    const userRef = admin.firestore().collection('users').doc(String(appUserId));
    await userRef.set({ entitlements, lastRevenueCatEvent: body?.event || body?.type || null, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

    res.status(200).send('ok');
    return;
  } catch (e) {
    console.error('revenueCatWebhookHandler error', e);
    res.status(500).send('error');
    return;
  }
}
