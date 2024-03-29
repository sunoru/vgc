import { PokemonDetails, PokemonIdent, Protocol } from '@pkmn/protocol'

import { ParsedBattle, ParsedPokemon, PlayerNumber } from './models/index.js'

export interface ImportReplayOptions {
  remarks?: string
  tags?: string[]
  whichIsUserPlayer?: (p1: string, p2: string) => Promise<PlayerNumber>
}

export interface RemoteReplay {
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

const isP1 = (p: string): boolean => {
  p = p.slice(0, 2)
  if (p === 'p1') {
    return true
  } else if (p === 'p2') {
    return false
  } else {
    throw new Error('Only two player battles are supported.')
  }
}

const getOrCreateParsedPokemon = (
  id: PokemonDetails,
  sentOut: Map<PokemonDetails, ParsedPokemon>,
): ParsedPokemon => {
  if (sentOut.has(id)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sentOut.get(id)!
  }
  const poke = {
    id: id.split(',')[0],
    moves: [],
    sentOutOrder: sentOut.size,
  }
  sentOut.set(id, poke)
  return poke
}

const setAbilityItem = (pokes: Record<PokemonIdent, ParsedPokemon>, from: string, of: string) => {
  if (!(of in pokes)) {
    return
  }
  const poke = pokes[of as PokemonIdent]
  const [type, value] = from.split(':')
  switch (type.trim()) {
    case 'item':
      if (poke.item) break
      poke.item = value.trim()
      break
    case 'ability':
      if (poke.ability) break
      poke.ability = value.trim()
      break
  }
}

export const parseBattleLog = async (
  log: string,
  options: ImportReplayOptions = {},
): Promise<ParsedBattle> => {
  const team1: string[] = []
  const team2: string[] = []
  const team1SentOut = new Map<PokemonDetails, ParsedPokemon>()
  const team2SentOut = new Map<PokemonDetails, ParsedPokemon>()
  const currentPokemons: Record<PokemonIdent, ParsedPokemon> = {}
  const parsed: Partial<ParsedBattle> = {
    remarks: options.remarks,
    tags: options.tags?.map((x) => x.trim()) || [],
    team1,
    team2,
  }
  let turn = 0
  for await (const message of Protocol.parse(log)) {
    const { args } = message
    const type = args[0]
    if (type === 't:') {
      if (!parsed.time) {
        parsed.time = parseInt(args[1]) * 1000
      }
    }
    if (type === 'player') {
      const [, p, name, , rating] = args
      const r = rating ? parseInt(rating) : 0
      if (isP1(p)) {
        parsed.p1 = name
        parsed.rating1 = r
      } else {
        parsed.p2 = name
        parsed.rating2 = r
      }
    } else if (type === 'poke') {
      const name = args[2].split(',')[0]
      if (isP1(args[1])) {
        team1.push(name)
      } else {
        team2.push(name)
      }
    } else if (type === 'switch' || type === 'drag') {
      const [, pos, id] = args
      const poke = getOrCreateParsedPokemon(id, isP1(pos) ? team1SentOut : team2SentOut)
      currentPokemons[pos] = poke
    } else if (type === '-ability') {
      const [, pos, ability] = args
      currentPokemons[pos].ability = ability
    } else if (type === '-terastallize') {
      const [, pos, teraType] = args
      currentPokemons[pos].teraType = teraType
    } else if (type === 'move') {
      const [, pos, move] = args
      const moves = currentPokemons[pos].moves
      if (!moves.includes(move)) {
        moves.push(move)
      }
    } else if (type === '-enditem') {
      const [, pos, item] = args
      currentPokemons[pos].item = item
    } else if (type === '-activate') {
      const [, pos, effect] = args
      if (pos) {
        if (effect.startsWith('item:')) {
          currentPokemons[pos].item = effect.slice(5).trim()
        } else if (effect.startsWith('ability:')) {
          currentPokemons[pos].ability = effect.slice(8).trim()
        }
      }
    } else if (type === 'detailschange') {
      const [, pos, id] = args
      const sentOut = isP1(pos) ? team1SentOut : team2SentOut
      const poke = currentPokemons[pos]
      let previousKey: PokemonDetails | undefined = undefined
      for (const [key, value] of sentOut.entries()) {
        if (value === poke) {
          previousKey = key
          break
        }
      }
      if (previousKey) {
        sentOut.delete(previousKey)
      }
      sentOut.set(id, poke)
    } else if (type === 'turn') {
      turn = parseInt(args[1])
    } else if (type === 'win') {
      parsed.winner = args[1] === parsed.p1 ? PlayerNumber.Player1 : PlayerNumber.Player2
    } else {
      if ('from' in message.kwArgs) {
        if ('of' in message.kwArgs) {
          setAbilityItem(currentPokemons, message.kwArgs.from as string, message.kwArgs.of as string)
        } else {
          const [, pos] = args
          setAbilityItem(currentPokemons, message.kwArgs.from as string, pos as PokemonIdent)
        }
      }
    }
  }
  const cmp = (a: ParsedPokemon, b: ParsedPokemon) => a.sentOutOrder - b.sentOutOrder
  parsed.team1SentOut = Array.from(team1SentOut.values()).sort(cmp)
  parsed.team2SentOut = Array.from(team2SentOut.values()).sort(cmp)
  parsed.numTurns = turn
  if (options.whichIsUserPlayer && parsed.p1 && parsed.p2) {
    parsed.userPlayer = await options.whichIsUserPlayer(parsed.p1, parsed.p2)
  } else {
    parsed.userPlayer = PlayerNumber.Unknown
  }
  parsed.timeParsed = Date.now()
  return new ParsedBattle(parsed)
}

export const importReplay = async (
  idOrURL: string,
  options: ImportReplayOptions & { password?: string } = {},
): Promise<ParsedBattle> => {
  const password = options.password
  let url = idOrURL.match(/^https?:\/\//i)
    ? idOrURL
    : `https://replay.pokemonshowdown.com/${idOrURL}${password ? `-${password}` : ''}`
  if (url.endsWith('.json')) {
    url = url.slice(0, -5)
  }
  if (url.endsWith('.log')) {
    url = url.slice(0, -4)
  }
  const jsonURL = `${url}.json`
  const response = await fetch(jsonURL)
  const data = (await response.json()) as RemoteReplay
  const log = data.log
  const parsed = await parseBattleLog(log, options)
  parsed.id = data.id
  parsed.url = url
  parsed.format = data.format
  parsed.formatid = data.formatid
  parsed.rating = data.rating
  return parsed
}
