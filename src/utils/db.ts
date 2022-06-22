import Dexie, { Table } from 'dexie'

import { ParsedBattle } from './models'
import { ScriptSnippet } from './scripts'

export type TableNames = 'battles' | 'scripts'

export class VGCDatabase extends Dexie {
  battles!: Table<ParsedBattle>
  scripts!: Table<ScriptSnippet>

  constructor() {
    super('vgc')
    this.version(3).stores({
      battles: 'id',
      scripts: 'id',
    })
  }
}

let _db: VGCDatabase | null = null

export const getDB = () => (_db ??= new VGCDatabase())
