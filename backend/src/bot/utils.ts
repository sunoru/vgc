import { ChatInputCommandInteraction } from 'discord.js'
import { db } from '../db/index.js'
import { getUser } from '../db/query.js'
import { user } from '../db/schema.js'
import { BotMessage } from './types.js'

const getAuthor = (message: BotMessage | ChatInputCommandInteraction) => {
  if ('author' in message) {
    return message.author
  }
  return message.user
}

export const getOrCreateUser = async (message: BotMessage | ChatInputCommandInteraction) => {
  const author = getAuthor(message)
  const discordId = BigInt(author.id)
  const existing = await getUser(discordId)
  if (existing) {
    return existing
  }
  const { username: discordUsername, displayName: name } = author
  return (await db.insert(user).values({ discordId, discordUsername, name }).returning())[0]
}
