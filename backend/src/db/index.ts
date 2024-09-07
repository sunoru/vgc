import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import config from '../config.js'
import * as schema from './schema.js'
import postgres from 'postgres'

export const setupDb = () => {
  const queryClient = postgres(config.db.url)
  db = drizzle(queryClient, { schema })
}

export let db: PostgresJsDatabase<typeof schema>
