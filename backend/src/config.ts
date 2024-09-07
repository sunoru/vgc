import dotenv from 'dotenv'
dotenv.config()

const getEnv = (key: string, defaultValue?: string): string => {
  if (process.env[key]) {
    return process.env[key] as string
  }
  if (defaultValue !== undefined) {
    return defaultValue
  }
  throw new Error(`Missing environment variable: ${key}`)
}

const getDiscordBotConfig = () => {
  return getEnv('DISABLE_BOT', 'false') === 'true'
    ? null
    : {
        token: getEnv('DISCORD_BOT_TOKEN'),
        clientId: getEnv('DISCORD_CLIENT_ID', ''),
        clientSecret: getEnv('DISCORD_CLIENT_SECRET', ''),
        redirectUri: getEnv('DISCORD_REDIRECT_URI', ''),
      }
}

const DB = {
  url: getEnv('DATABASE_URL'),
}

const config = {
  debug: getEnv('DEBUG', 'false') === 'true',
  port: parseInt(getEnv('PORT', '3000')),
  db: DB,
  discordBot: getDiscordBotConfig(),
}

export default config
