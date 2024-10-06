import { importReplay } from '../../features/import-replay.js'
import { BotMessage } from '../types.js'
import { getOrCreateUser } from '../utils.js'

export const splitRemarks = (input: string) => {
  input = input.trim()
  const i = input.search(/\s/)
  return i >= 0 ? { url: input.slice(0, i), remarks: input.slice(i + 1) } : { url: input, remarks: '' }
}

export const importReplayFromMessage = async (message: BotMessage) => {
  // Silently ignore unrelated messages
  const lines = message.content.trim().split('\n', 2)
  if (lines.length !== 1) {
    return
  }
  const { url, remarks } = splitRemarks(lines[0])
  try {
    new URL(url)
  } catch {
    return
  }
  const user = await getOrCreateUser(message)
  const { status } = await importReplay(url, remarks, user.id)
  if (status === 'success') {
    console.log('Replay imported:', url)
    await message.react('✅')
  } else if (status === 'skipped') {
    console.log('Replay skipped:', url)
    await message.react('⏭️')
  } else {
    console.error('Failed to import replay:', url)
    await message.react('❌')
  }
}
