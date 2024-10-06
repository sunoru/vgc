import { Hono } from 'hono'

import { setupBot } from './bot/setup.js'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'
import { routes } from './routes/index.js'
import config from './config.js'
import { setupDb } from './db/index.js'
import { serve } from '@hono/node-server'

setupDb()

const app = new Hono({})
app.use('*', csrf())
app.use(logger())
routes(app)

if (config.discord.botToken) {
  const bot = setupBot()
  await bot.start()
}

serve({
  fetch: app.fetch,
  port: config.port,
})
console.log(`Server running on port ${config.port}`)
