import * as Sentry from '@sentry/react-native';

export function initSentry(dsn?: string) {
  try {
    if (!dsn) return;
    Sentry.init({
      dsn,
      // Adjust tracesSampleRate in production as needed
      tracesSampleRate: 0.1,
    });
  } catch (e) {
    // non-fatal init errors shouldn't crash the app
    // eslint-disable-next-line no-console
    console.warn('Sentry init failed', e);
  }
}
