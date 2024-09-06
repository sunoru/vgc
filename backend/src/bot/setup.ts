import { createBot, Intents } from '@discordeno/bot'
import { tryImportReplays } from './commands/replays.js'
import { BotMessage } from './types.js'

export const setupBot = () => {
  const bot = createBot({
    token: process.env.DISCORD_BOT_TOKEN!,
    intents:
      Intents.MessageContent |
      Intents.Guilds |
      Intents.GuildMessages |
      Intents.GuildMessageReactions |
      Intents.DirectMessages |
      Intents.DirectMessageReactions,
    events: {
      ready: (data) => {
        console.log(`The shard ${data.shard} is ready!`)
      },
      messageCreate: async (message) => {
        // Only support replay importing for now.
        const botMessage = message as BotMessage
        botMessage.bot = bot
        await tryImportReplays(botMessage)
      },
    },
  })

  bot.transformers.desiredProperties.message.id = true
  bot.transformers.desiredProperties.message.content = true
  bot.transformers.desiredProperties.message.channelId = true

  return bot
}
