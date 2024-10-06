import { importReplayFromMessage } from './commands/replays.js'
import config from '../config.js'
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js'
import { handleCommand } from './commands/index.js'

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
      if (message.interactionMetadata) return
      // Only support replay importing for messages
      await importReplayFromMessage(message)
    })
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return
      await handleCommand(interaction)
    })
    this.client = client
  }
  async start() {
    await this.client.login(this.token)
  }
}

export const setupBot = () => {
  const { botToken } = config.discord
  if (!botToken) {
    throw new Error('Bot is disabled')
  }
  const bot = new Bot(botToken)
  return bot
}
