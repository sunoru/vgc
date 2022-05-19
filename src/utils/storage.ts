import { ParsedBattle, ParsedBattles } from './models'
import { LocalConfigs } from './config'

const databaseName = 'vgc'
const databaseVersion = 1
let _db: IDBDatabase | null = null
export const getIDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    if (_db !== null) return resolve(_db)
    const request = indexedDB.open(databaseName, databaseVersion)
    request.onerror = (event) => reject(event)
    request.onupgradeneeded = (event) => {
      const db = request.result
      const _battleStore = db.createObjectStore('battles', { keyPath: 'id' })
    }
    request.onsuccess = (_) => {
      _db = request.result
      _db.onerror = (event) => {
        console.error('Database error:', event)
      }
      resolve(_db)
    }
  })

let _cachedBattles: ParsedBattles | null = null
const _getBattlesFromIDB = async (): Promise<ParsedBattles> => {
  const db = await getIDB()
  const transaction = db.transaction(['battles'], 'readonly')
  const battleStore = transaction.objectStore('battles')
  const request = battleStore.getAll()
  return new Promise((resolve, reject) => {
    request.onerror = (event) => reject(event)
    request.onsuccess = () => {
      _cachedBattles = {}
      for (const battle of request.result) {
        _cachedBattles[battle.id] = battle
      }
      resolve(_cachedBattles)
    }
  })
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
    const db = await getIDB()
    const transaction = db.transaction(['battles'], 'readwrite')
    const battleStore = transaction.objectStore('battles')
    const request = battleStore.put(battle)
    return new Promise((resolve, reject) => {
      request.onerror = (event) => reject(event)
      request.onsuccess = async () => {
        const battles = await getAllSavedBattles()
        battles[battle.id] = battle
        resolve(battle)
      }
    })
  } else {
    throw new Error('Not implemented')
  }
}

export const saveBattles = async (
  battles: ParsedBattles
): Promise<ParsedBattle[]> => {
  if (LocalConfigs.useLocalStorage) {
    const db = await getIDB()
    const transaction = db.transaction(['battles'], 'readwrite')
    const battleStore = transaction.objectStore('battles')
    return Promise.all(
      Object.values(battles).map((battle) => {
        const request = battleStore.put(battle)
        return new Promise<ParsedBattle>((resolve, reject) => {
          request.onerror = (event) => reject(event)
          request.onsuccess = async () => {
            const battles = await getAllSavedBattles()
            battles[battle.id] = battle
            resolve(battle)
          }
        })
      })
    )
  } else {
    throw new Error('Not implemented')
  }
}
