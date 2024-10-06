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

const PORT = parseInt(getEnv('PORT', '3000'))

const getDiscordConfig = () => ({
  botToken: getEnv('DISCORD_BOT_TOKEN', ''),
  clientId: getEnv('DISCORD_CLIENT_ID', ''),
  clientSecret: getEnv('DISCORD_CLIENT_SECRET', ''),
})

const DB = {
  url: getEnv('DATABASE_URL'),
}

const config = {
  debug: getEnv('DEBUG', 'false') === 'true',
  port: PORT,
  baseUrl: getEnv('BASE_URL', `http://localhost:${PORT}`),
  db: DB,
  discord: getDiscordConfig(),
}

export default config
