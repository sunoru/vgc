import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { player, playerToUser } from '../db/schema.js'
import { BadRequest, NotFound } from '../utils/errors.js'
import { showdown } from 'vgc-tools'

// The functions only take IDs as arguments, leaving the caller to handle the authentication

// Claim the ownership of a showdown player account
export const claimPlayer = async (ownerId: number, username: string, password: string) => {
  const existingPlayer = await db.query.player.findFirst({
    where: eq(player.username, username),
  })
  if (existingPlayer && existingPlayer.ownerId !== null) {
    throw new BadRequest('This account is already claimed')
  }
  const authenticated = await showdown.login(username, password)
  if (!authenticated) {
    throw new BadRequest('Invalid username or password')
  }
  await db
    .insert(player)
    .values({
      username,
      password,
      ownerId: ownerId,
    })
    .onConflictDoUpdate({
      target: player.username,
      set: {
        password,
        ownerId: ownerId,
      },
    })
  console.log(`User ${ownerId} claimed ${username}`)
}

// Share a showdown player account with another user
export const sharePlayer = async (ownerId: number, username: string, targetId: number) => {
  if (ownerId === targetId) {
    throw new BadRequest('You cannot share with yourself')
  }
  const p = await db.query.player.findFirst({
    where: eq(player.username, username),
  })
  if (!p) {
    throw new NotFound('Player not found')
  }
  if (p.ownerId !== ownerId) {
    throw new BadRequest('You do not own this account')
  }
  await db.insert(playerToUser).values({ playerId: p.id, userId: targetId })
  console.log(`User ${ownerId} shared ${username} with ${targetId}`)
}
