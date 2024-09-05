import { createBot, Intents } from '@discordeno/bot'

import dotenv from 'dotenv'
dotenv.config()

const bot = createBot({
  token: process.env.DISCORD_BOT_TOKEN!,
  intents: Intents.Guilds | Intents.GuildMessages, // Or other intents that you might needs.
  events: {
    ready: (data) => {
      console.log(`The shard ${data.shard} is ready!`)
    },
  },
})

// You can add events after the createBot call if you prefer

bot.events.messageCreate = (message) => {
  // Do stuff with the message object ...
  console.log(message.content)
  console.log(message)
}

await bot.start()
