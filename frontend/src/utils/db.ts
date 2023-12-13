import Dexie, { type Table } from 'dexie'

import { ParsedBattle } from 'vgc-tools'

export type TableNames = 'battles'
export class VGCDatabase extends Dexie {
  battles!: Table<ParsedBattle, string>
  // TODO: refactor scripts
  scripts!: Table<unknown, string>

  constructor() {
    super('vgc')
    this.version(3).stores({
      battles: 'id',
      scripts: 'id',
    })
    this.battles.mapToClass(ParsedBattle)
  }
}

let _db: VGCDatabase | null = null

export const getDB = () => (_db ??= new VGCDatabase())
