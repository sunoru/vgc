import Immutable from 'immutable'
import { v5 as uuidv5 } from 'uuid'

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

export type ScriptType = 'filter' | 'analyzer' | string
export const ScriptNamespaceUUID = '5dc11aaf-fe4f-4848-8507-4e09f47a18a8'

export interface ScriptSnippet {
  type: ScriptType
  key: string
  name: string
  code: string
}

export const defineDefaultScripts = (
  type: ScriptType,
  funcs: Array<[string, (..._: never[]) => unknown]>
): ScriptSnippet[] =>
  funcs.map(([name, func]) => ({
    type,
    key: uuidv5(name, ScriptNamespaceUUID),
    name,
    code: func.toString(),
  }))
