import { init } from '@sentry/node'
import config from '@/config.js'
import '@sentry/tracing'

init({
  dsn: config.SENTRY_DSN,
  tracesSampleRate: config.NODE_ENV === 'production' ? 0.2 : 1,
})
