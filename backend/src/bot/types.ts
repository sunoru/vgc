import { Message, MessageReaction, PartialMessage, PartialMessageReaction } from 'discord.js'

export type BotMessage<InGuild extends boolean = boolean> = Message<InGuild> | PartialMessage
export type BotReaction = MessageReaction | PartialMessageReaction
