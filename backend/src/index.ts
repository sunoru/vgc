import { Hono } from 'hono'

import { setupBot } from './bot/setup.js'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'
import { routes } from './routes/index.js'
import config from './config.js'

const app = new Hono()
app.use('*', csrf())
app.use(logger())
routes(app)

if (config.discordBot) {
  const bot = setupBot()
  await bot.start()
}
