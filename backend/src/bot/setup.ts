import { importReplayFromMessage } from './commands/replays.js'
import config from '../config.js'
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js'

class Bot {
  public client: Client
  constructor(private token: string) {
    const client = new Client({
      intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
      ],
      partials: [Partials.Channel],
    })
    client.on('error', console.log)
    client.once(Events.ClientReady, (client) => {
      console.log(`Logged in as ${client.user?.tag}!`)
    })
    client.on(Events.MessageCreate, async (message) => {
      // Only support replay importing for messages
      await importReplayFromMessage(message)
    })
    this.client = client
  }
  async start() {
    await this.client.login(this.token)
  }
}

export const setupBot = () => {
  if (!config.discordBot) {
    throw new Error('Bot is disabled')
  }
  const bot = new Bot(config.discordBot.token)
  return bot
}
