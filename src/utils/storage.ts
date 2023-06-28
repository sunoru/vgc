import { Table } from 'dexie'
import { TableNames, VGCDatabase, getDB } from './db'
import { getLocalConfig } from '../stores/config'

export type Cache<T> = Record<string, T>

type ObjectType<T extends TableNames> = VGCDatabase[T] extends Table<infer R> ? R : never

const _cachedObjects: Cache<unknown> = {}

const _getObjectsFromIDB = async <T extends TableNames>(tableName: T): Promise<Cache<ObjectType<T>>> => {
  const db = getDB()
  const cached: Cache<ObjectType<T>> = (_cachedObjects[tableName] = {})
  for (const x of await db[tableName].toArray()) {
    cached[x.id] = x as ObjectType<T>
  }
  return cached
}

export const getAllSavedObjects = async <T extends TableNames>(
  tableName: T,
  force = false
): Promise<Cache<ObjectType<T>>> => {
  if (force || !(tableName in _cachedObjects)) {
    if (getLocalConfig().useLocalStorage) {
      await _getObjectsFromIDB(tableName)
    } else {
      throw new Error('Not implemented')
    }
  }
  return _cachedObjects[tableName] as Cache<ObjectType<T>>
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
  if (getLocalConfig().useLocalStorage) {
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
  objects: Record<string, ObjectType<T> & { id: string }> | (ObjectType<T> & { id: string })[]
): Promise<ObjectType<T>[]> => {
  const items = Object.values(objects)
  if (getLocalConfig().useLocalStorage) {
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
  if (getLocalConfig().useLocalStorage) {
    const db = getDB()
    await (db[tableName] as Table<ObjectType<T>>).delete(key)
  } else {
    throw new Error('Not implemented')
  }
  return x
}
