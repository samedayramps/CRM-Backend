// backend/src/instrument.js

const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

Sentry.init({
  dsn: 'https://707064ec340e27e1d42e543cd6e77cbd@o4507863689199616.ingest.us.sentry.io/4507863692345344', // Replace with your actual Sentry DSN
  integrations: [
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  profilesSampleRate: 1.0, // Set sampling rate for profiling - this is relative to tracesSampleRate
});