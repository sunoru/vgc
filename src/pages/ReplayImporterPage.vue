<template>
  <q-page class="row items-center justify-evenly">
    <q-ajax-bar
      ref="bar"
      position="top"
      color="accent"
      size="10px"
      skip-hijack
    />
    <div class="q-pa-md col" style="max-width: 720px">
      <div class="text-h3">Replay Importer</div>
      <q-form @submit="parse" class="q-mt-md">
        <q-input
          outlined
          v-model="textInput"
          label="Replay URLs"
          autogrow
          type="textarea"
        />
        <q-btn
          class="q-mt-sm"
          color="primary"
          label="Import All"
          type="submit"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { QAjaxBar } from 'quasar'
import { defineComponent, ref } from 'vue'
import { showDialog, selectDialog } from '../utils/dialog'

import {
  Config,
  ParsedBattle,
  ParsedBattles,
  PlayerNumber,
  Pokemon,
} from '../utils/models'
import {
  getConfig,
  getSavedBattle,
  saveBattles,
  saveConfig,
} from '../utils/storage'

const getPokeInTeam = (team: Pokemon[], poke: string): Pokemon => {
  for (const p of team) {
    if (p.id == poke) {
      return p
    }
  }
  const p: Pokemon = { id: poke, moves: [] }
  team.push(p)
  return p
}

const setAbilityItem = (
  pokes: { [key: string]: Pokemon },
  from: string,
  of: string
) => {
  if (from.startsWith('[from]')) {
    from = from.slice(6)
  }
  if (of.startsWith('[of]')) {
    of = of.slice(4)
  }
  const pos = of.split(':')[0].trim()
  if (!(pos in pokes)) {
    return
  }
  const poke = pokes[pos]
  const [type, value] = from.split(':')
  switch (type.trim()) {
    case 'item':
      poke.item = value.trim()
      break
    case 'ability':
      poke.ability = value.trim()
      break
  }
}

const getUserPlayer = async (
  p1: string,
  p2: string,
  config?: Config
): Promise<PlayerNumber> => {
  const myUsernames = config?.myUsernames ?? []
  if (myUsernames.includes(p1)) {
    return PlayerNumber.Player1
  }
  if (myUsernames.includes(p2)) {
    return PlayerNumber.Player2
  }
  const p = await selectDialog(
    'Which is your username?',
    'Neither',
    p1,
    p2
  )
  if (p !== 0 && config !== undefined) {
    myUsernames.push(p === 1 ? p1 : p2)
    await saveConfig(config)
  }
  return p
}

const parseReplay = async (
  id: string,
  password: string
): Promise<ParsedBattle> => {
  const config = await getConfig()
  const url = `https://replay.pokemonshowdown.com/${id}${
    password ? `-${password}` : ''
  }.json`
  const replayJSON = await fetch(url)
  console.log(replayJSON)
  const data = await replayJSON.json()
  const { uploadtime, p1, p2, format, log } = data
  const logs = log.split('\n')
  let isWinnerP1 = false
  const team1: string[] = []
  const team2: string[] = []
  const team1SentOut: Pokemon[] = []
  const team2SentOut: Pokemon[] = []
  const currentPokemons: { [key: string]: Pokemon } = {}
  let time = uploadtime
  for (const line of logs) {
    const args = line.split('|')
    const argc = args.length
    if (argc < 2 || args[1] === '') {
      continue
    }
    const command = args[1]
    switch (command) {
      case 't:': {
        time = parseInt(args[2])
        break
      }
      case 'poke': {
        const team = args[2] === 'p1' ? team1 : team2
        const poke = args[3].split(',')[0]
        team.push(poke)
        break
      }
      case 'switch': {
        const pos = args[2].split(':')[0]
        const poke = args[3].split(',')[0]
        const team = pos.slice(0, 2) === 'p1' ? team1SentOut : team2SentOut
        currentPokemons[pos] = getPokeInTeam(team, poke)
        break
      }
      case 'move': {
        const pos = args[2].split(':')[0]
        const poke = currentPokemons[pos]
        const move = args[3]
        const moves = poke.moves || []
        if (!moves.includes(move)) {
          moves.push(move)
          poke.moves = moves
        }
        break
      }
      case '-ability': {
        const pos = args[2].split(':')[0]
        const poke = currentPokemons[pos]
        const ability = args[3]
        poke.ability = ability
        break
      }
      case 'win': {
        isWinnerP1 = args[2] === p1
        break
      }
      default: {
        if (
          args[argc - 2].startsWith('[from]') &&
          args[argc - 1].startsWith('[of]')
        ) {
          setAbilityItem(currentPokemons, args[argc - 2], args[argc - 1])
        } else if (args[argc - 1].startsWith('[from]')) {
          setAbilityItem(currentPokemons, args[argc - 1], args[2])
        }
        break
      }
    }
  }
  return {
    time,
    platform: 'Showdown',
    id,
    url,
    p1,
    p2,
    format,
    timeParsed: Math.floor(Date.now() / 1000),
    winner: isWinnerP1 ? PlayerNumber.Player1 : PlayerNumber.Player2,
    team1,
    team2,
    team1SentOut,
    team2SentOut,
    remarks: '',
    tags: [],
    userPlayer: await getUserPlayer(p1, p2, config),
    log,
  }
}

const ShowdownURLRegex =
  /^https:\/\/replay.pokemonshowdown.com\/(?<id>\w+?-\w+)(-(?<password>\w+))?(?<remarks>\s+.*)?$/

interface ImportResult {
  battles: ParsedBattles
  skipped: number
}

const updateRemarks = (battle: ParsedBattle, remarks: string[]): number => {
  const remarksText = remarks.join('\n')
  if (battle.remarks !== remarksText) {
    battle.remarks += remarksText
    return 0
  }
  return 1
}

const importAll = async (
  text: string,
  ajaxBar: QAjaxBar
): Promise<ImportResult> => {
  const lines = text.split('\n')
  const stepSize = 100 / lines.length
  let currentBattle: ParsedBattle | null = null
  let remarks: string[] = []
  let skipped = 0
  const battles: ParsedBattles = {}
  for (const line of lines) {
    const m = ShowdownURLRegex.exec(line)
    if (m === null || m.groups === undefined) {
      if (currentBattle !== null) {
        const t = line.trim()
        if (t !== '') {
          remarks.push(t)
        }
      }
      continue
    }
    if (currentBattle !== null) {
      skipped += updateRemarks(currentBattle, remarks)
      remarks = []
    }
    const { id, password, remarks: inlineRemarks } = m.groups
    console.log(`Importing ${id}...`)
    currentBattle = id in battles ? battles[id] : await getSavedBattle(id)
    if (currentBattle === null) {
      currentBattle = await parseReplay(id, password)
    }
    if (inlineRemarks !== undefined) {
      const t = inlineRemarks.trim()
      if (t !== '') {
        remarks.push(t)
      }
    }
    battles[id] = currentBattle
    ajaxBar.increment(stepSize)
  }
  if (currentBattle !== null) {
    skipped += updateRemarks(currentBattle, remarks)
  }
  console.log('Finished!')
  await saveBattles(battles)
  console.log('Saved')
  return {
    battles,
    skipped,
  }
}

export default defineComponent({
  name: 'ReplayImporterPage',
  setup: () => {
    const textInput = ref('')
    const bar = ref<QAjaxBar>()

    const parse = async () => {
      const barRef = bar.value
      if (!barRef) {
        return
      }
      barRef.start(0)
      try {
        const input = textInput.value.trim()
        if (input === '') {
          showDialog('Invalid input.', 'negative')
          return
        }
        const result = await importAll(input, barRef)
        const n = Object.keys(result.battles).length
        showDialog(`${n - result.skipped}/${n} Imported.`)
        textInput.value = ''
      } catch (e) {
        console.error(e)
        showDialog('Something went wrong.', 'negative')
      } finally {
        barRef.stop()
      }
    }

    return {
      textInput,
      bar,
      parse,
    }
  },
})
</script>
