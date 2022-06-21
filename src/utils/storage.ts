import { ParsedBattle, ParsedBattles } from 'vgc-base/src/models'
import { LocalConfigs } from './config'
import { getDB } from './db'

let _cachedBattles: ParsedBattles | null = null
const _getBattlesFromIDB = async (): Promise<ParsedBattles> => {
  const db = getDB()
  _cachedBattles = {}
  for (const battle of await db.battles.toArray()) {
    _cachedBattles[battle.id] = battle
  }
  return _cachedBattles
}

export const getAllSavedBattles = async (
  force = false
): Promise<ParsedBattles> => {
  if (force || _cachedBattles === null) {
    if (LocalConfigs.useLocalStorage) {
      _cachedBattles = await _getBattlesFromIDB()
    } else {
      throw new Error('Not implemented')
    }
  }
  return _cachedBattles
}

export const getSavedBattle = async (
  id: string,
  force = false
): Promise<ParsedBattle | null> => {
  const battles = await getAllSavedBattles(force)
  return id in battles ? battles[id] : null
}

export const saveBattle = async (
  battle: ParsedBattle
): Promise<ParsedBattle> => {
  if (LocalConfigs.useLocalStorage) {
    const db = getDB()
    await db.battles.put(battle)
  } else {
    throw new Error('Not implemented')
  }
  const battles = await getAllSavedBattles()
  battles[battle.id] = battle
  return battle
}

export const saveBattles = async (
  battles: ParsedBattles
): Promise<ParsedBattle[]> => {
  const items = Object.values(battles)
  if (LocalConfigs.useLocalStorage) {
    const db = getDB()
    await db.battles.bulkPut(items)
  } else {
    throw new Error('Not implemented')
  }
  const saved = await getAllSavedBattles()
  for (const item of items) {
    saved[item.id] = item
  }
  return items
}
