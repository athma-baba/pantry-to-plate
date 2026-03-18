Sentry setup

This repo includes a minimal Sentry init for React Native.

1) Install native packages (already added to `package.json`):

```bash
# install JS dependency
npm install @sentry/react-native --save
```

2) Native setup
- Follow Sentry's official RN setup for native configuration (upload debug symbols):
  https://docs.sentry.io/platforms/react-native/
- You will need to run the Sentry CLI to upload dSYMs / Proguard mappings during release builds.

3) Provide DSN
- Provide a Sentry DSN in your environment (e.g. `.env`) as `SENTRY_DSN` or set it at runtime.

4) Verify
- Run the app and trigger an error to verify it shows up in Sentry.

Notes
- The JS init is tolerant to missing DSN (no-op when not provided).
- For production, set `tracesSampleRate` appropriately and configure release and environment tags.
