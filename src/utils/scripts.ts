import Immutable from 'immutable'

import { BattlePlayer, ParsedBattle, PlayerNumber, Team } from './models'
import {
  normalizeName,
  compareName,
  makePokemonSet,
  getPlayer,
  getOpponent,
  hasPokes,
  sentOutPokes,
  getRestrictedPokes,
  categorize,
} from './helpers'

export interface ScriptSnippet {
  key: string
  name: string
  code: string
}

const myBattles = (battle: ParsedBattle) =>
  battle.userPlayer !== PlayerNumber.None

const myTeam = (battle: ParsedBattle, pokes: string[]) =>
  hasPokes(getPlayer(battle, battle.userPlayer), pokes)

const opponentTeam = (battle: ParsedBattle, pokes: string[]) =>
  hasPokes(getOpponent(battle), pokes)

export const defaultFilters: ScriptSnippet[] = [
  {
    key: 'myBattles',
    name: 'My Battles',
    code: myBattles.toString(),
  },
  {
    key: 'myTeam',
    name: 'My Team',
    code: myTeam.toString(),
  },
  {
    key: 'opponentTeam',
    name: "Opponent's Team",
    code: opponentTeam.toString(),
  },
]

const teamWinningPercentage = (
  battles: ParsedBattle[],
  getTeam: (p: BattlePlayer) => Team = (p) => p.team
) => {
  const data = categorize(battles, (battle) => getTeam(getOpponent(battle)))
  return [...data]
    .map(([team, bs]) => {
      const win = bs.filter((b) => b.winner === b.userPlayer).length
      const total = bs.length
      return {
        key: team.toArray(),
        win,
        total,
        winningPercentage: win / total,
      }
    })
    .sort((a, b) => b.total - a.total)
}

const restrictedWinningPercentage = (battles: ParsedBattle[]) =>
  teamWinningPercentage(battles, getRestrictedPokes)

const teamSentOut = (
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
        win:
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
const restrictedSentOut = (battles: ParsedBattle[], onlyLeads = true) =>
  teamSentOut(battles, onlyLeads, getRestrictedPokes)

export const defaultAnalyzers: ScriptSnippet[] = [
  {
    key: 'teamWinningPercentage',
    name: 'Winning Percentage Against Different Teams',
    code: teamWinningPercentage.toString(),
  },
  {
    key: 'restrictedWinningPercentage',
    name: 'Winning Percentage Against Different Restricted Pokes',
    code: restrictedWinningPercentage.toString(),
  },
  {
    key: 'teamSentOut',
    name: 'Sent Out Pokes of Different Teams',
    code: teamSentOut.toString(),
  },
  {
    key: 'restrictedSentOut',
    name: 'Sent Out Pokes of Different Restricted Pokes',
    code: restrictedSentOut.toString(),
  },
]
