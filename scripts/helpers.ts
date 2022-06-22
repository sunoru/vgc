import { RestrictedPokemons } from './consts'
import {
  ParsedBattle,
  PlayerNumber,
  BattlePlayer,
  Team,
} from '../src/utils/models'

// Only cover some common cases
export const normalizeName = (name: string): string => {
  if (!name.includes('-')) return name
  if (['Necrozma-', 'Calyrex-', 'Kyurem-'].some((x) => name.startsWith(x)))
    return name
  if (name.endsWith('-Gmax')) name = name.slice(0, -5)
  const tmp = name.split('-', 2)
  return tmp.length === 1 ? name : `${tmp[0]}-*`
}

export const compareName = (a: string, b: string) =>
  normalizeName(a) === normalizeName(b)

export const makePokemonSet = (pokes: string[] | Team): Team =>
  Immutable.Set(Array.isArray(pokes) ? pokes.map(normalizeName) : pokes)

export const getPlayer = (
  battle: ParsedBattle,
  nameOrIsPlayer2: string | boolean | PlayerNumber
): BattlePlayer => {
  const isPlayer2 =
    typeof nameOrIsPlayer2 === 'boolean'
      ? nameOrIsPlayer2
      : typeof nameOrIsPlayer2 === 'string'
      ? nameOrIsPlayer2 === battle.p2
      : nameOrIsPlayer2 === PlayerNumber.Player2

  return {
    name: isPlayer2 ? battle.p2 : battle.p1,
    team: Immutable.Set(
      (isPlayer2 ? battle.team2 : battle.team1).map(normalizeName)
    ),
    sentOut: isPlayer2 ? battle.team2SentOut : battle.team1SentOut,
  }
}

export const getOpponent = (battle: ParsedBattle): BattlePlayer =>
  battle.userPlayer === PlayerNumber.None
    ? { name: '', team: Immutable.Set([]), sentOut: [] }
    : getPlayer(battle, battle.userPlayer === PlayerNumber.Player1)

export const hasPokes = (
  player: BattlePlayer,
  pokes: string[] | Team
): boolean => player.team.isSuperset(makePokemonSet(pokes))

export const sentOutPokes = (
  player: BattlePlayer,
  pokes: string[] | Team
): boolean =>
  makePokemonSet(player.sentOut.map((x) => x.id)).isSuperset(
    makePokemonSet(pokes)
  )

export const getRestrictedPokes = (player: BattlePlayer): Team => {
  return player.team.filter((x) => RestrictedPokemons.includes(x))
}

export const categorize = <TKey, T>(
  items: T[],
  getKey: (item: T) => TKey
): Immutable.Map<TKey, T[]> => {
  let data = Immutable.Map<TKey, T[]>()
  for (const item of items) {
    const key = getKey(item)
    const list = data.get(key) || []
    list.push(item)
    if (!data.has(key)) {
      data = data.set(key, list)
    }
  }
  return data
}
