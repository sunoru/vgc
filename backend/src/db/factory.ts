import { db } from './index.js'
import { user } from './schema.js'

export const createUser = async (name: string, discordId: bigint, discordUsername: string) =>
  await db
    .insert(user)
    .values({
      name,
      discordId,
      discordUsername,
    })
    .onConflictDoNothing()
    .returning()

// TODO:
// Add functions when they are needed
