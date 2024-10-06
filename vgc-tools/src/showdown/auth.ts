const ACTION_API_URL = 'https://play.pokemonshowdown.com/~~showdown/action.php'

export const login = async (username: string, password: string) => {
  const res = await fetch(ACTION_API_URL, {
    body: new URLSearchParams({
      act: 'login',
      name: username,
      pass: password,
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  const cookies = res.headers.getSetCookie()
  if (res.status !== 200 || cookies.length === 0) {
    return null
  }
  const s = await res.text()
  const data = JSON.parse(s.slice(1)) as {
    actionsuccess: boolean
    curuser: {
      username: string
      userid: string
    }
  }
  if (!data.actionsuccess) {
    return null
  }
  const sid = decodeURIComponent(cookies[0].split(';')[0].split('=')[1])
  return {
    sid,
    userid: data.curuser.userid,
    username: data.curuser.username,
  }
}
