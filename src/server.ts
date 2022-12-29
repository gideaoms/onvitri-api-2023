import { app } from '@/app.js'
import { Config } from '@/config.js'

app.listen({ port: Config.APP_PORT, host: Config.APP_HOST }).catch(err => {
  app.log.error(err)
  process.exit(1)
})
