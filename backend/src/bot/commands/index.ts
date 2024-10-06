import { ChatInputCommandInteraction } from 'discord.js'
import { COMMANDS } from './utils.js'

export const handleCommand = async (interaction: ChatInputCommandInteraction) => {
  const handler = COMMANDS.get(interaction.commandName)
  if (!handler) {
    await interaction.reply('Unknown command')
    return
  }
  try {
    await handler.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  }
}

import './auth.js'
import './replays.js'

export { COMMANDS }
