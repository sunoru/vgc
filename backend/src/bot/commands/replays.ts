import { importReplay, importReplays } from '../../features/replays.js'
import { BadRequest } from '../../utils/errors.js'
import { BotHandler, BotMessage } from '../types.js'
import { reactWith, replyWith } from '../utils.js'

const splitRemarks = (input: string) => {
  const i = input.trim().search(/\s/)
  return i >= 0 ? { url: input.slice(0, i), remarks: input.slice(i + 1) } : { url: input, remarks: '' }
}

const importOneReplay = async (message: BotMessage, input: string) => {
  const { url, remarks } = splitRemarks(input)
  const { status } = await importReplay(url, remarks)
  if (status === 'success') {
    await reactWith(message, '✅')
  } else if (status === 'skipped') {
    await reactWith(message, '⏭️')
  } else {
    await reactWith(message, '❌')
  }
}

const importManyReplays = async (message: BotMessage, lines: string[]) => {
  let suceeded = 0,
    failed = 0,
    skipped = 0
  const results = await importReplays(lines.map((line) => splitRemarks(line)))
  for (const { status } of results) {
    if (status === 'success') {
      suceeded++
    } else if (status === 'skipped') {
      skipped++
    } else {
      failed++
    }
  }
  const result = `Import completed: ${suceeded} succeeded, ${failed} failed, ${skipped} skipped.`
  await replyWith(message, result)
}

export const tryImportReplays: BotHandler = async (message) => {
  const input = message.content
  if (!input) {
    throw new BadRequest('empty message')
  }
  const lines = input.split('\n')
  if (lines.length === 1) {
    await importOneReplay(message, input)
    return
  }
  await importManyReplays(message, lines)
}
