import { Hono } from 'hono'

import replays from './replays.js'

export const routes = (app: Hono) => {
  app.route('/replays', replays)
}
