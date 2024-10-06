import { REST, Routes, SharedSlashCommand } from 'discord.js'
import '../src/bot/commands'

import { COMMANDS } from '../src/bot/commands'
import config from '../src/config.js'

const commands = Array.from(COMMANDS.values()).map((handler) => handler.data.toJSON())

const { botToken, clientId } = config.discord

const rest = new REST().setToken(botToken)

try {
  console.log(`Started refreshing ${commands.length} application (/) commands.`)

  // The put method is used to fully refresh all commands in the guild with the current set
  const data = (await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  })) as SharedSlashCommand[]

  console.log(data)

  console.log(`Successfully reloaded ${data.length} application (/) commands.`)
} catch (error) {
  // And of course, make sure you catch and log any errors!
  console.error(error)
}
