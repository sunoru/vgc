import Dexie, { Table } from 'dexie'

import { ParsedBattle } from './models'

export class VGCDatabase extends Dexie {
  battles!: Table<ParsedBattle>

  constructor() {
    super('vgc')
    this.version(1).stores({
      battles: 'id',
    })
  }
}

let _db: VGCDatabase | null = null

export const getDB = () => (_db ??= new VGCDatabase())
