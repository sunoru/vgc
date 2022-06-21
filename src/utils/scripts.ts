import { v5 as uuidv5 } from 'uuid'

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

export const defaultFilters = defineDefaultScripts('filter', [
  ['My Battles', window.vgcScripts.defaultScripts.myBattles],
  ['My Team', window.vgcScripts.defaultScripts.myTeam],
  ['Opponent Team', window.vgcScripts.defaultScripts.opponentTeam],
])

export const defaultAnalyzers = defineDefaultScripts('analyzer', [
  [
    'Sent Out Pokes of Different Teams',
    window.vgcScripts.defaultScripts.teamSentOut,
  ],
  [
    'Sent Out Pokes of Different Restricted Pokes',
    window.vgcScripts.defaultScripts.restrictedSentOut,
  ],
])
