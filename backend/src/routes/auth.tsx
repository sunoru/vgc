import { Hono } from 'hono'
import config from '../config.js'
import { NotFound } from '../utils/errors.js'

const auth = new Hono()

const discordConfig = config.discord!
const redirectUri = `${config.baseUrl}/auth/oauth2_callback`

const oauth2Url = (() => {
  return `https://discord.com/oauth2/authorize?client_id=${
    discordConfig.clientId
  }&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=identify`
})()

// TODO: implement
auth.get('/', (c) => c.json({ message: 'Get auth state' }))
auth.get('/oauth2_callback', async (c) => {
  const { code } = c.req.query()
  if (!code) {
    throw new NotFound()
  }
  try {
    const tokenResponseData = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: discordConfig.clientId,
        client_secret: discordConfig.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        scope: 'identify',
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    const oauthData = await tokenResponseData.json()
    const _userResult = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${oauthData.token_type} ${oauthData.access_token}`,
      },
    })
    // TODO: create user in database
  } catch (error) {
    // NOTE: An unauthorized token will not throw an error
    // tokenResponseData.statusCode will be 401
    console.error(error)
  }
  return c.json({ code })
})

auth.get('/signin', (c) => {
  return c.redirect(oauth2Url)
  //   return c.html(`<!DOCTYPE html>
  // <html>
  // 	<head>
  // 		<title>My Discord OAuth2 App</title>
  // 	</head>
  // 	<body>
  // 		<div id="info">Hoi!</div>
  // 	</body>
  // </html>`)
})

export default auth
