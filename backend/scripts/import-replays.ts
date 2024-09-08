import { readFileSync } from 'fs'
import { importReplays } from '../src/features/replays.js'
import { splitRemarks } from '../src/bot/commands/replays.js'
import { setupDb } from '../src/db/index.js'

const inputFile = process.argv[2]
console.log(`Importing replays from ${inputFile}`)

setupDb()

const input = readFileSync(inputFile, 'utf8')
const lines = input.trim().split('\n')
const inputData = lines
  .map((x) => x.trim())
  .filter((x) => x)
  .map(splitRemarks)
const n = inputData.length
let success = 0
let skipped = 0
let failed = 0
const startTimestamp = Date.now()
await importReplays(inputData, {
  minInterval: 0.1,
  updateProgress: (i, urlOrResult) => {
    if (typeof urlOrResult === 'string') {
      console.log(`(${i + 1}/${n}) Importing ${urlOrResult}`)
    } else {
      const { status } = urlOrResult
      if (status === 'success') {
        console.log('✅')
        success++
      } else if (status === 'skipped') {
        console.log('⏭️')
        skipped++
      } else {
        console.log('❌')
        console.error(urlOrResult.error)
        failed++
      }
    }
  },
})
console.log(`Imported ${success} replays, skipped ${skipped}, failed ${failed}`)
console.log(`Time taken: ${(Date.now() - startTimestamp) / 1000} seconds`)
process.exit(0)
