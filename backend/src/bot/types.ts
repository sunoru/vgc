import { Bot, Message } from '@discordeno/bot'

export type BotMessage = Message & {
  bot: Bot
}
export type BotHandler = (message: BotMessage) => void | Promise<void>
