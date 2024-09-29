import { Hono } from 'hono'
import { Bindings, Variables } from '../../bindings'

const params = new Hono<{ Bindings: Bindings; Variables: Variables }>()

params.get('/', c => {
  const filename = c.req.query('filename')
  const contentType = c.req.query('type')
  const path = c.req.query('metadata[path]')
  if (!filename || !contentType || !path) {
    return c.json({ error: 'Some params missing' }, { status: 400 })
  }

  return c.json({ message: 'Hello' })
})

export default params
