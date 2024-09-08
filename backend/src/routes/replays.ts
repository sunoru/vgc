import { Hono } from 'hono'

const replays = new Hono()

// TODO: implement
replays.get('/', (c) => c.json({ message: 'Get all replays' }))

replays.get('/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ message: `Get replay ${id}` })
})

replays.post('/', (c) => c.json({ message: 'Create a replay' }))

replays.post('/upload', (c) => c.json({ message: 'Upload a replay' }))

export default replays
