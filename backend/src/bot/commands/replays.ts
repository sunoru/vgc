import { importReplay } from '../../features/replays.js'
import { BotMessage } from '../types.js'

const splitRemarks = (input: string) => {
  const i = input.trim().search(/\s/)
  return i >= 0 ? { url: input.slice(0, i), remarks: input.slice(i + 1) } : { url: input, remarks: '' }
}

export const importReplayFromMessage = async (message: BotMessage) => {
  // Silently ignore unrelated messages
  const lines = message.content.trim().split('\n', 2)
  console.log('lines', lines)
  if (lines.length !== 1) {
    return
  }
  const { url, remarks } = splitRemarks(lines[0].trim())
  try {
    new URL(url)
  } catch {
    return
  }
  const { status } = await importReplay(url, remarks)
  if (status === 'success') {
    await message.react('✅')
  } else if (status === 'skipped') {
    await message.react('⏭️')
  } else {
    await message.react('❌')
  }
}
