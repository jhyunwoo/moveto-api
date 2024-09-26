import type { Context } from 'hono'

export default function getAuth(c: Context) {
  const session = c.get('session')
  const user = c.get('user')
  return { session, user }
}
