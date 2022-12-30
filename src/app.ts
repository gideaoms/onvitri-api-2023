import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { fastify } from 'fastify'
import autoload from '@fastify/autoload'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import staticy from '@fastify/static'
import helmet from '@fastify/helmet'
import { Config } from '@/config.js'
import { captureException } from '@/infra/libs/sentry.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = fastify({
  logger: Config.NODE_ENV === 'development',
})

app.setErrorHandler(async err => {
  app.log.error(err)
  captureException(err)
  throw err
})

app.register(helmet)
app.register(cors)
app.register(staticy, {
  root: join(__dirname, '..', 'tmp'),
  prefix: '/images',
})
app.register(multipart)
app.register(autoload, {
  dir: join(__dirname, 'infra', 'controllers'),
  options: { prefix: '/v1' },
  dirNameRoutePrefix: true,
})

export { app }
