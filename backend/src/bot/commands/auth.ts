// export const linkUserCommand =
//

import { claimPlayer } from '../../features/auth.js'
import { getOrCreateUser } from '../utils.js'
import { registerCommand } from './utils.js'

registerCommand(
  (data) =>
    data
      .setName('claim-player')
      .setDescription('Claim the ownership of a showdown player')
      .addStringOption((option) =>
        option.setName('username').setDescription('Showdown username').setRequired(true),
      )
      .addStringOption((option) =>
        option.setName('password').setDescription('Showdown password').setRequired(true),
      ),
  async (interaction) => {
    const username = interaction.options.getString('username')
    const password = interaction.options.getString('password')
    if (!username || !password) {
      await interaction.reply('Empty username or password')
      return
    }
    const user = await getOrCreateUser(interaction)
    try {
      await claimPlayer(user.id, username, password)
      interaction.reply(`Claimed ${username}`)
    } catch (err) {
      interaction.reply((err as Error).toString())
    }
    // const password = interaction.
    // await interaction.reply('Not implemented')
  },
)

registerCommand(
  (data) => data.setName('share-player').setDescription('Share a showdown player account with another user'),
  async (interaction) => {
    await interaction.reply('Not implemented')
  },
)
