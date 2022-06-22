import { Table } from 'dexie'

import { LocalConfigs } from './config'
import { getDB, TableNames, VGCDatabase } from './db'

type ObjectType<T extends TableNames> = VGCDatabase[T] extends Table<infer R>
  ? R
  : never

const _cachedObjects: Record<string, unknown> = {}

const _getObjectsFromIDB = async <T extends TableNames>(
  tableName: T
): Promise<Record<string, ObjectType<T>>> => {
  const db = getDB()
  const cached: Record<string, ObjectType<T>> = (_cachedObjects[tableName] = {})
  for (const x of await db[tableName].toArray()) {
    cached[x.id] = x as ObjectType<T>
  }
  return cached
}

export const getAllSavedObjects = async <T extends TableNames>(
  tableName: T,
  force = false
): Promise<Record<string, ObjectType<T>>> => {
  if (force || !(tableName in _cachedObjects)) {
    if (LocalConfigs.useLocalStorage) {
      await _getObjectsFromIDB(tableName)
    } else {
      throw new Error('Not implemented')
    }
  }
  return _cachedObjects[tableName] as Record<string, ObjectType<T>>
}

export const getSavedObject = async <T extends TableNames>(
  tableName: T,
  id: string,
  force = false
): Promise<ObjectType<T> | null> => {
  const objects = await getAllSavedObjects(tableName, force)
  return id in objects ? objects[id] : null
}

export const saveObject = async <T extends TableNames>(
  tableName: T,
  x: ObjectType<T> & { id: string }
): Promise<ObjectType<T>> => {
  if (LocalConfigs.useLocalStorage) {
    const db = getDB()
    await (db[tableName] as Table<ObjectType<T>>).put(x)
  } else {
    throw new Error('Not implemented')
  }
  const cached = await getAllSavedObjects(tableName)
  cached[x.id] = x
  return x
}

export const saveObjects = async <T extends TableNames>(
  tableName: T,
  objects:
    | Record<string, ObjectType<T> & { id: string }>
    | (ObjectType<T> & { id: string })[]
): Promise<ObjectType<T>[]> => {
  const items = Object.values(objects)
  if (LocalConfigs.useLocalStorage) {
    const db = getDB()
    await (db[tableName] as Table<ObjectType<T>>).bulkPut(items)
  } else {
    throw new Error('Not implemented')
  }
  const saved = await getAllSavedObjects(tableName)
  for (const item of items) {
    saved[item.id] = item
  }
  return items
}

export const deleteObject = async <T extends TableNames>(
  tableName: T,
  objectOrKey: (ObjectType<T> & { id: string }) | string
): Promise<ObjectType<T> | undefined> => {
  const key = typeof objectOrKey === 'string' ? objectOrKey : objectOrKey.id
  const cached = await getAllSavedObjects(tableName)
  if (!(key in cached)) {
    return
  }
  const x = cached[key]
  delete cached[key]
  if (LocalConfigs.useLocalStorage) {
    const db = getDB()
    await (db[tableName] as Table<ObjectType<T>>).delete(key)
  } else {
    throw new Error('Not implemented')
  }
  return x
}
