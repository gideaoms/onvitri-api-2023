import { app } from '@/app.js'
import * as Config from '@/config.js'

app.listen({ port: Config.PORT, host: Config.HOST }).catch(err => {
  app.log.error(err)
  process.exit(1)
})
