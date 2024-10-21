import { importReplayFromMessage } from './commands/replays.js'
import config from '../config.js'
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js'
import { handleCommand } from './commands/index.js'
import { BotMessage, BotReaction } from './types.js'

class Bot {
  public client: Client
  public userId!: string
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
      partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    })
    client.on('error', console.error)
    client.once(Events.ClientReady, (client) => {
      if (!client.user) {
        throw new Error('Client user is undefined')
      }
      const { tag, id } = client.user
      console.log(`Logged in as ${tag}!`)
      this.userId = id
    })
    client.on(Events.MessageCreate, this.handleMessage.bind(this))
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return
      await handleCommand(interaction)
    })
    client.on(Events.Raw, async (packet) => {
      if (packet.t === 'MESSAGE_REACTION_ADD') {
        await this.handleReactionAdd(packet.d)
      }
    })
    this.client = client
  }

  async start() {
    await this.client.login(this.token)
  }

  async handleMessage(message: BotMessage) {
    if (message.partial) {
      message = await message.fetch()
    }
    if (message.interactionMetadata) return
    // Only support replay importing for messages
    await importReplayFromMessage(message)
  }

  async handleReactionAdd(reaction: BotReaction | { user_id: string, channel_id: string, message_id: string }) {
    let message: BotMessage;
    if (!('message' in reaction)) {
      // If the message is not cached,
      const { user_id: userId, channel_id: channelId, message_id: messageId } = reaction
      if (userId == this.userId) return
      const channel = await this.client.channels.fetch(channelId)
      if (!channel || !channel.isTextBased()) return
      message = await channel.messages.fetch(messageId)
    } else {
      if (reaction.me) return
      if (reaction.partial) {
        reaction = await reaction.fetch()
      }
      message = reaction.message
    }
    await this.handleMessage(message)
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
