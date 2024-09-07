import { eq, InferSelectModel, Table } from 'drizzle-orm'
import { db } from './index.js'
import { player, replay, user } from './schema.js'

type QueryOptions = {
  with?: Record<string, boolean>
}

// Just @ts-ignore for the ease
const _getById = <T extends Table>(tableName: string, table: T, idName = 'id') => {
  return async (id: number, options: QueryOptions = {}) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    (await db.query[tableName].findFirst({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      where: eq(table[idName], id),
      with: options.with,
    })) as InferSelectModel<T> | undefined
}

export const getUserById = _getById('user', user)
export const getPlayerById = _getById('player', player)
export const getReplayByPk = _getById('replay', replay, 'ok')

export const getUser = async (discordId: bigint, options: QueryOptions = {}) =>
  await db.query.user.findFirst({
    where: eq(user.discordId, discordId),
    with: options.with,
  })
