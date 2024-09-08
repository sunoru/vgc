export interface ShowdownReplay {
  // The URL of the replay
  id: string
  format: string
  players: string[]
  log: string
  uploadtime: number
  views: number
  formatid: string
  rating: number
  private: number
  password: number | null
}

export const fetchReplayData = async (idOrUrl: string | URL, password?: string) => {
  const url =
    idOrUrl instanceof URL
      ? idOrUrl
      : new URL(
          idOrUrl.match(/^https?:\/\//i)
            ? idOrUrl
            : `https://replay.pokemonshowdown.com/${idOrUrl}${password ? `-${password}` : ''}`,
        )
  const urlString = url.href
  url.pathname += '.json'
  const response = await fetch(url)
  const data = (await response.json()) as ShowdownReplay
  return {
    url: urlString,
    data,
  }
}
