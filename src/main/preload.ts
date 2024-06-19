import '../../static/styles/globals.css'
import '../../static/styles/preloader.css'
import * as Sentry from '@sentry/electron/renderer'

Sentry.init({
    dsn: 'https://6aaeb7f8130ebacaad9f8535d0c77aa8@o4507369806954496.ingest.de.sentry.io/4507369809182800',
    attachStacktrace: true,
    integrations: [
        Sentry.replayIntegration(),
        Sentry.browserTracingIntegration(),
        Sentry.browserProfilingIntegration(),
    ],
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
    profilesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', /^https:\/\/api\.pulsesync\.dev/],
})
