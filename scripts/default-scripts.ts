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
      return {
        key: team.toArray(),
        win: bs.filter((b) => b.winner === b.userPlayer).length,
        total: bs.length,
        sentOuts: [...data2]
          .map(([sentOut, bs2]) => ({
            sentOut,
            win: bs2.filter((b) => b.winner === b.userPlayer).length,
            total: bs2.length,
          }))
          .sort((a, b) => b.total - a.total),
      }
    })
    .sort((a, b) => b.total - a.total)
}
export const restrictedSentOut = (battles: ParsedBattle[], onlyLeads = true) =>
  teamSentOut(battles, onlyLeads, getRestrictedPokes)
