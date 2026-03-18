Functions deployment / webhook secret

The RevenueCat webhook handler supports verification using an HMAC-SHA256 secret.

Provide the secret in one of these ways:

1) Using `functions.config()` (recommended for deployments):

```bash
firebase functions:config:set revenuecat.webhook_secret="YOUR_SECRET"
```

2) Or set the environment variable `REVENUECAT_WEBHOOK_SECRET` in your Cloud Functions runtime (via the GCP Console or Secret Manager).

After setting the secret, rebuild and deploy functions:

```bash
npm --prefix functions run build
firebase deploy --only functions --project pantrytoplate-1773751381
```

Notes
- The handler accepts signatures in hex or base64 and allows a common `sha256=` prefix.
- If you don't configure a secret, the webhook will still accept payloads (no verification). Configure a secret for production.
