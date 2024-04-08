export const getCPTiers = async (data: Array<{ cp: number; pasteUrl: string }>) => {
  const pokes = {} as { [poke: string]: number }
  for (const { cp, pasteUrl } of data) {
    console.log(`${cp} from ${pasteUrl}`)
    const response = await fetch(pasteUrl.trim() + '/json')
    const data = (await response.json()) as { paste: string }
    for (const poke of data.paste.split('\r\n\r\n')) {
      const [firstLine] = poke.split('\r\n')
      const pokeName = firstLine.split('@')[0].trim()
      if (pokeName) {
        if (!(pokeName in pokes)) {
          pokes[pokeName] = 0
        }
        pokes[pokeName] += cp
      }
    }
  }
  const tiers = {} as { [tier: number]: string[] }
  for (const poke in pokes) {
    const cp = pokes[poke]
    if (!(cp in tiers)) {
      tiers[cp] = []
    }
    tiers[cp].push(poke)
  }
  return Object.entries(tiers)
    .map(([cp, pokes]) => ({ cp: +cp, pokes }))
    .sort((a, b) => b.cp - a.cp)
}
