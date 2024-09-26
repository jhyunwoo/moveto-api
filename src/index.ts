import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { cors } from 'hono/cors'
import auth from './auth/route'

const sites = ['http://localhost:3000', 'https://www.moveto.kr', 'https://moveto.kr']

const app = new Hono()

app.use(
  csrf({
    origin: sites,
  })
)
app.use(
  cors({
    origin: sites,
  })
)

app.get('/', c => {
  return c.json({ message: 'Moveto API' })
})

app.route('/auth', auth)

export default app
