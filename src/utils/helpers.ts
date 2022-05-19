import { ParsedBattle, Pokemon, PlayerNumber } from './models'

export const getTeam = (
  battle: ParsedBattle,
  isPlayer2: boolean
): Pokemon[] => {
  const pokes: Pokemon[] = []
  const sentOut: string[] = []
  for (const poke of isPlayer2 ? battle.team2SentOut : battle.team1SentOut) {
    pokes.push(poke)
    sentOut.push(poke.id)
  }
  for (const poke of isPlayer2 ? battle.team2 : battle.team1) {
    let o = false
    for (const each of sentOut) {
      if (
        (poke.endsWith('*') && each.startsWith(poke.slice(0, -1))) ||
        sentOut.includes(poke)
      ) {
        o = true
        break
      }
    }
    if (!o) {
      pokes.push({ id: poke, moves: [] })
    }
  }
  return pokes
}

export const getOpponentTeam = (battle: ParsedBattle): Pokemon[] =>
  battle.userPlayer === PlayerNumber.None
    ? []
    : getTeam(battle, battle.userPlayer === PlayerNumber.Player1)
