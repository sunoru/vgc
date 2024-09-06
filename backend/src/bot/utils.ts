import { BotMessage } from './types.js'

export const reactWith = async (message: BotMessage, emoji: string) => {
  await message.bot.helpers.addReaction(message.channelId, message.id, emoji)
}

export const replyWith = async (message: BotMessage, content: string) => {
  await message.bot.helpers.sendMessage(message.channelId, {
    content,
    messageReference: {
      messageId: message.id,
      failIfNotExists: false,
    },
  })
}
