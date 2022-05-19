import { Config, ParsedBattle, ParsedBattles } from './models'

export const useLocalStorage = true

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
    if (useLocalStorage) {
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
  if (useLocalStorage) {
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
  if (useLocalStorage) {
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

let _cachedConfig: Config | null = null

export const getConfig = async (force = false): Promise<Config> => {
  if (force || _cachedConfig === null) {
    if (useLocalStorage) {
      const saved = localStorage.getItem('config')
      _cachedConfig =
        saved === null
          ? {
              myUsernames: [],
            }
          : (JSON.parse(saved) as Config)
    } else {
      // TODO
      throw new Error('Not implemented')
    }
  }
  return _cachedConfig
}

export const saveConfig = async (config: Config) => {
  if (useLocalStorage) {
    localStorage.setItem('config', JSON.stringify(config))
    _cachedConfig = config
  } else {
    // TODO
    throw new Error('Not implemented')
  }
}
