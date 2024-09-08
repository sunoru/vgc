import { importReplay as importReplayImpl, ParsedBattle } from 'vgc-tools'
import { BadRequest } from '../utils/errors.js'
import { nullOnZero, sleep } from '../utils/misc.js'
import { db } from '../db/index.js'
import { format, player, playerToTeam, poke, replay as replayTable, team } from '../db/schema.js'
import { and, eq } from 'drizzle-orm'
import { CurrentGeneration } from 'vgc-tools/dist/data/dex.js'

export const hasImported = async (url: URL) => {
  const id = url.pathname.slice(1).split('-', 2).join('-')
  return (
    (await db.query.replay.findFirst({
      where: eq(replayTable.id, id),
    })) !== undefined
  )
}

export const getOrCreatePlayer = async (username: string) => {
  const existing = await db.query.player.findFirst({
    where: eq(player.username, username),
  })
  if (existing) {
    return existing
  }
  return (await db.insert(player).values({ username }).returning())[0]
}

export const getOrCreatePoke = async (name: string) => {
  const existing = await db.query.poke.findFirst({
    where: eq(poke.name, name),
  })
  if (existing) {
    return existing
  }
  const species = CurrentGeneration.species.get(name)
  const dexId = species?.id ?? null
  return (await db.insert(poke).values({ dexId, name }).returning())[0]
}

export const getPokeIds = async (pokeNames: string[]) => {
  const pokes = (await Promise.all(pokeNames.map(getOrCreatePoke))).map((x) => x.id)
  pokes.sort()
  return pokes
}

export const getOrCreateTeam = async (pokeNames: string[]) => {
  const pokes = await getPokeIds(pokeNames)
  const existing = await db.query.team.findFirst({
    where: eq(team.pokes, pokes),
  })
  if (existing) {
    return existing
  }
  return (await db.insert(team).values({ pokes }).returning())[0]
}

export const getOrCreateFormat = async (key: string, name: string) => {
  const existing = await db.query.format.findFirst({
    where: eq(format.key, key),
  })
  if (existing) {
    return existing
  }
  return (await db.insert(format).values({ key, name }).returning())[0]
}

export const linkPlayerTeam = async (playerId: number, teamId: number) => {
  const existing = await db.query.playerToTeam.findFirst({
    where: and(eq(playerToTeam.playerId, playerId), eq(playerToTeam.teamId, teamId)),
  })
  if (existing) {
    return
  }
  await db.insert(playerToTeam).values({ playerId, teamId })
}

export const saveReplay = async (battle: ParsedBattle) => {
  if (battle.platform !== 'Showdown') {
    throw new BadRequest('Only Showdown replays are supported.')
  }
  const player1 = await getOrCreatePlayer(battle.p1)
  const player2 = await getOrCreatePlayer(battle.p2)
  const team1 = await getOrCreateTeam(battle.team1)
  const team2 = await getOrCreateTeam(battle.team2)
  await linkPlayerTeam(player1.id, team1.id)
  await linkPlayerTeam(player2.id, team2.id)
  const format = await getOrCreateFormat(battle.format, battle.formatid)
  const replay = (
    await db
      .insert(replayTable)
      .values({
        id: battle.id,
        time: new Date(battle.time),
        url: battle.url,
        player1Id: player1.id,
        player2Id: player2.id,
        team1Id: team1.id,
        team2Id: team2.id,
        formatId: format.id,
        rating1: nullOnZero(battle.rating1),
        rating2: nullOnZero(battle.rating2),
        rating: nullOnZero(battle.rating),
        numTurns: battle.numTurns === undefined ? null : battle.numTurns,
        winner: battle.winner,
        team1SentOutPokes: await getPokeIds(battle.team1SentOut.map((x) => x.id)),
        team1SentOut: battle.team1SentOut,
        team2SentOutPokes: await getPokeIds(battle.team2SentOut.map((x) => x.id)),
        team2SentOut: battle.team2SentOut,
        remarks: battle.remarks,
        tags: battle.tags,
        log: battle.log ?? '',
      })
      .returning()
  )[0]
  return replay
}

export interface ImportReplayResult {
  status: 'success' | 'error' | 'skipped'
  error?: Error
  battle?: ParsedBattle
}

export const importReplay = async (urlString: string, remarks = ''): Promise<ImportReplayResult> => {
  let url: URL
  try {
    url = new URL(urlString)
  } catch {
    return {
      status: 'error',
      error: new BadRequest('The message does not contain a valid URL.'),
    }
  }
  try {
    if (await hasImported(url)) {
      return { status: 'skipped' }
    }
    const battle = await importReplayImpl(url, { remarks })
    battle.remarks = remarks
    await saveReplay(battle)
    return {
      status: 'success',
      battle,
    }
  } catch (e) {
    console.error(e)
    return {
      status: 'error',
      error: new BadRequest('The replay could not be imported.'),
    }
  }
}

// minInterval: minimum interval between imports in seconds
export const importReplays = async (
  input: Array<{ url: string; remarks?: string }>,
  options: {
    minInterval?: number
    updateProgress?: (i: number, urlOrResult: string | ImportReplayResult) => void
  } = {},
) => {
  const { minInterval = 1, updateProgress = () => {} } = options
  const parsed: ImportReplayResult[] = []
  let i = 0
  for (const { url, remarks } of input) {
    updateProgress(i, url)
    const p = sleep(minInterval * 1000)
    const x = await importReplay(url, remarks)
    parsed.push(x)
    await p
    updateProgress(i++, x)
  }
  return parsed
}
