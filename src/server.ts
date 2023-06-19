import { app } from '@/app.js'
import config from '@/config.js'

app
  .listen({
    port: config.PORT,
    host: config.HOST,
  })
  .catch(err => {
    app.log.error(err)
    process.exit(1)
  })

console.log('testing')
