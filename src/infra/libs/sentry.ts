import { init, captureException } from '@sentry/node'
import { Config } from '@/config.js'
import '@sentry/tracing'

init({
  dsn: Config.SENTRY_DSN,
  tracesSampleRate: Config.NODE_ENV === 'production' ? 0.2 : 1,
})

export { captureException }
