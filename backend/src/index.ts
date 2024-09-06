import dotenv from 'dotenv'
import { Hono } from 'hono'

import { setupBot } from './bot/setup.js'
import { csrf } from 'hono/csrf'
import { logger } from 'hono/logger'
import { routes } from './routes/index.js'

dotenv.config()

const app = new Hono()
app.use('*', csrf())
app.use(logger())
routes(app)

if (!process.env.DISABLE_BOT) {
  const bot = setupBot()
  await bot.start()
}
