import { ChatInputCommandInteraction, SharedSlashCommand, SlashCommandBuilder } from 'discord.js'

export type CommandHandler = {
  data: SlashCommandBuilder
  execute(interaction: ChatInputCommandInteraction): Promise<void>
}

export const COMMANDS = new Map<string, CommandHandler>()

export const registerCommand = (
  setup: (data: SlashCommandBuilder) => SharedSlashCommand,
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>,
) => {
  const data = new SlashCommandBuilder()
  setup(data)
  COMMANDS.set(data.name, {
    data,
    execute,
  })
}
