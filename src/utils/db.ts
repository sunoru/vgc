import Dexie, { Table } from 'dexie'

import { ParsedBattle } from './models'
import { ScriptSnippet } from './scripts'

export class VGCDatabase extends Dexie {
  battles!: Table<ParsedBattle>
  scriptSnippets!: Table<ScriptSnippet>

  constructor() {
    super('vgc')
    this.version(2).stores({
      battles: 'id',
      scriptSnippets: 'key',
    })
  }
}

let _db: VGCDatabase | null = null

export const getDB = () => (_db ??= new VGCDatabase())
