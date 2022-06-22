import {
  BattlePlayer,
  ParsedBattle,
  PlayerNumber,
  Team,
} from '../src/utils/models'
import {
  getPlayer,
  getOpponent,
  hasPokes,
  getRestrictedPokes,
  categorize,
} from './helpers'

export const myBattles = (battle: ParsedBattle) =>
  battle.userPlayer !== PlayerNumber.None

export const myTeam = (battle: ParsedBattle, pokes: string[]) =>
  hasPokes(getPlayer(battle, battle.userPlayer), pokes)

export const opponentTeam = (battle: ParsedBattle, pokes: string[]) =>
  hasPokes(getOpponent(battle), pokes)

export const teamSentOut = (
  battles: ParsedBattle[],
  onlyLeads = true,
  maxSentOutPairs = 3,
  getTeam: (p: BattlePlayer) => Team = (p) => p.team
) => {
  const data = categorize(battles, (battle) => getTeam(getOpponent(battle)))
  return [...data]
    .map(([team, bs]) => {
      const data2 = categorize(bs, (b) =>
        Immutable.Set(
          getOpponent(b)
            .sentOut.slice(0, onlyLeads ? 2 : 4)
            .map((x) => x.id)
        )
      )
      const sentOuts = [...data2]
        .map(([sentOut, bs2]) => {
          return {
            sentOut,
            win: bs2.filter((b) => b.winner === b.userPlayer).length,
            total: bs2.length,
          }
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, maxSentOutPairs)
      const win = bs.filter((b) => b.winner === b.userPlayer).length
      const result = {
        key: team.toArray(),
        win,
        total: bs.length,
        winningPercentage: `${((win / bs.length) * 100).toFixed(2)}%`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as Record<string, any>
      sentOuts.forEach((x, i) => {
        result[`sentOut${i + 1}`] = x.sentOut
        result[`sentOut${i + 1} Win`] = x.win
        result[`sentOut${i + 1} Total`] = x.total
      })
      return result
    })
    .sort((a, b) => b.total - a.total)
}
export const restrictedSentOut = (
  battles: ParsedBattle[],
  onlyLeads = true,
  maxSentOutPairs = 3
) => teamSentOut(battles, onlyLeads, maxSentOutPairs, getRestrictedPokes)
