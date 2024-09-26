import { DrizzleD1Database } from 'drizzle-orm/d1'
import { InsertUser, SelectUser, users } from '../db/schema'
import { eq } from 'drizzle-orm'

/**
 * Get user by email
 * @param db - Drizzle DB
 * @param email - User email
 */
export async function getUser(db: DrizzleD1Database, email: string): Promise<SelectUser | null> {
  const result = await db.select().from(users).where(eq(users.email, email))
  if (!result || result.length === 0) {
    return null
  }

  return result[0]
}

/**
 * Insert user with user data
 * @param db - Drizzle DB
 * @param data - User data
 */
export async function insertUser(db: DrizzleD1Database, data: InsertUser): Promise<SelectUser | null> {
  const result = await db.insert(users).values(data).returning()
  if (!result || result.length === 0) {
    return null
  }

  return result[0]
}
