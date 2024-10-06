import { Hono } from 'hono'

import auth from './auth.js'
import replays from './replays.js'

export const routes = (app: Hono) => {
  app.route('/auth', auth)
  app.route('/replays', replays)
}
