import { Hono } from 'hono'
import { Bindings, Variables } from '../../bindings'

const multipart = new Hono<{ Bindings: Bindings; Variables: Variables }>()

multipart.post('/', async c => {
  return c.json({ key: 'result.Key', uploadId: 'result.UploadId' })
})

export default multipart
