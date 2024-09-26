import { Hono } from 'hono'
import { Bindings, Variables } from '../bindings'
import { zValidator } from '@hono/zod-validator'
import { drizzle } from 'drizzle-orm/d1'
import { getUser, insertUser } from '../lib/users'
import { Scrypt } from 'lucia'
import { initializeLucia } from '../lib/lucia'
import { z } from 'zod'
import { luciaAuth } from '../middleware/lucia-auth'
import getAuth from '../lib/get-auth'

/**
 * Sign In Schema for validating request body
 */
const signUpSchema = z
  .object({
    email: z.string().min(1).email(),
    password: z.string().min(1).max(255),
    confirmPassword: z.string().min(1).max(255),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

/**
 * Sign Up Schema for validating request body
 */
const signInSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1).max(255),
})

// Create Auth Route
const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>()

auth.use(luciaAuth)

// Sign In Route
auth.post('/sign-in', zValidator('json', signInSchema), async c => {
  const userData = getAuth(c)
  if (userData.user && userData.session) {
    return c.json({ message: 'Sign In Success' }, 200)
  }

  const { email, password } = c.req.valid('json')
  const db = drizzle(c.env.DB)

  const user = await getUser(db, email)
  if (!user) {
    return c.json({ error: 'Invalid email or password.' }, 400)
  }

  const validPassword = await new Scrypt().verify(user.password, password)
  if (!validPassword) {
    return c.json({ error: 'Invalid email or password.' }, 400)
  }

  const lucia = initializeLucia(c.env.DB)
  const session = await lucia.createSession(user.id, {})
  const cookie = lucia.createSessionCookie(session.id)

  c.header('Set-Cookie', cookie.serialize(), { append: true })

  return c.json({ message: 'Sign In Success' }, 200)
})

// Sign Up Route
auth.post('/sign-up', zValidator('json', signUpSchema), async c => {
  const userData = getAuth(c)
  if (userData.user && userData.session) {
    return c.json({ message: 'Sign Up Success' }, 200)
  }

  const { email, password } = c.req.valid('json')

  const db = drizzle(c.env.DB)

  const existingUser = await getUser(db, email)
  if (existingUser) {
    return c.json({ error: 'User with that email already exists.' }, 400)
  }

  const passwordHash = await new Scrypt().hash(password)

  const user = await insertUser(db, {
    email,
    password: passwordHash,
  })
  if (!user) {
    return c.json({ error: 'An error occurred during sign up.' }, 500)
  }

  const lucia = initializeLucia(c.env.DB)
  const session = await lucia.createSession(user.id, {})
  const cookie = lucia.createSessionCookie(session.id)

  c.header('Set-Cookie', cookie.serialize(), { append: true })

  return c.json({ message: 'Sign Up Success' }, 200)
})

// Sign Out Route
auth.post('/sign-out', async c => {
  const lucia = initializeLucia(c.env.DB)
  const session = c.get('session')
  if (session) {
    await lucia.invalidateSession(session.id)
  }

  const cookie = lucia.createBlankSessionCookie()

  c.header('Set-Cookie', cookie.serialize(), { append: true })

  return c.json({ message: 'Sign Out Success' }, 200)
})

export default auth
