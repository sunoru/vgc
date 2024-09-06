import { importReplay as importReplayImpl, ParsedBattle } from 'vgc-tools'
import { BadRequest } from '../utils/errors.js'
import { sleep } from '../utils/misc.js'
import { loadMock } from './replay_mock.js'

export interface ImportReplayResult {
  status: 'success' | 'error' | 'skipped'
  error?: Error
  battle?: ParsedBattle
}

export const importReplay = async (url: string, remarks = ''): Promise<ImportReplayResult> => {
  try {
    new URL(url)
  } catch {
    return {
      status: 'error',
      error: new BadRequest('The message does not contain a valid URL.'),
    }
  }
  try {
    // TODO: Check if the replay has already been imported
    if (false) {
      return { status: 'skipped' }
    }
    // const battle = await importReplayImpl(url, { remarks })
    // TODO: remove mock
    const battle = await loadMock()
    battle.remarks = remarks
    // TODO: save to database
    return {
      status: 'success',
      battle,
    }
  } catch (e) {
    console.error(e)
    return {
      status: 'error',
      error: new BadRequest('The replay could not be imported.'),
    }
  }
}

// minInterval: minimum interval between imports in seconds
export const importReplays = async (
  input: Array<{ url: string; remarks?: string }>,
  options: { minInterval?: number } = {},
) => {
  const { minInterval = 1 } = options
  const parsed: ImportReplayResult[] = []
  for (const { url, remarks } of input) {
    try {
      const p = sleep(minInterval * 1000)
      const x = await importReplay(url, remarks)
      parsed.push(x)
      await p
    } catch {}
  }
  return parsed
}
