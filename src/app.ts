import '@total-typescript/ts-reset'
import path from 'path'
import { fileURLToPath } from 'url'
import { fastify } from 'fastify'
import autoload from '@fastify/autoload'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import staticy from '@fastify/static'
import helmet from '@fastify/helmet'
import { captureException } from '@sentry/node'
import * as Config from '@/config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const app = fastify({
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
  root: path.join(__dirname, '..', 'tmp'),
  prefix: '/images',
})
app.register(multipart)
app.register(autoload, {
  dir: path.join(__dirname, 'infra', 'controllers'),
  options: { prefix: '/v1' },
  dirNameRoutePrefix: false,
})
