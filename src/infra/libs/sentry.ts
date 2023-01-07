import { init } from '@sentry/node'
import * as Config from '@/config.js'
import '@sentry/tracing'

init({
  dsn: Config.SENTRY_DSN,
  tracesSampleRate: Config.NODE_ENV === 'production' ? 0.2 : 1,
})
