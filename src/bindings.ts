import type { User, Session } from 'lucia'

export type Bindings = {
  DB: D1Database
  BUCKET: R2Bucket
}

export type Variables = {
  user: User | null
  session: Session | null
}
