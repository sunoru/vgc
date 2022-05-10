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
      <div class="text-h3">Replay Parser</div>
      <q-form @submit="parse" class="q-mt-md">
        <q-input
          outlined
          v-model="urlText"
          label="Replay URL"
          :rules="[
            (val) =>
              /^https:\/\/replay.pokemonshowdown.com\/.+$/.test(val) ||
              'Invalid URL',
          ]"
        />
        <q-btn class="q-mt-sm" color="primary" label="Parse" type="submit" />
      </q-form>
      <q-card v-if="replay" class="q-mt-md">
        <q-tabs no-caps v-model="tab" class="text-teal">
          <q-tab name="p1" :label="`${replay.p1} (${replay.isWinnerP1 ? 'W' : 'L' })`" />
          <q-tab name="p2" :label="`${replay.p2} (${replay.isWinnerP1 ? 'L' : 'W' })`" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="p1">
            <div class="text-h6">{{ replay.p1 }}</div>
            <div class="row items-start justify-around">
              <replay-pokemon-card :pokemons="getCardPokemons(false)" />
            </div>
          </q-tab-panel>
          <q-tab-panel name="p2">
            <div class="text-h6">{{ replay.p2 }}</div>
            <div class="row items-start justify-around">
              <replay-pokemon-card :pokemons="getCardPokemons(true)" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
      <q-form v-if="replay" @submit="save" class="q-mt-md">
        <q-input
          outlined
          class="q-mb-md"
          v-model="remarksText"
          label="Remarks"
        />
        <div>
        <q-btn color="primary" label="Save" type="submit" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { QAjaxBar } from 'quasar'
import { defineComponent, ref } from 'vue'

import ReplayPokemonCard from '../components/ReplayPokemonCard.vue'
import { ParsedBattle, Pokemon } from '../utils/models'
import { saveBattle } from '../utils/storage'


const getPokeInTeam = (
  team: Pokemon[],
  poke: string
): Pokemon => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseReplay = (data: any): ParsedBattle => {
  const { uploadtime: time, id, password, p1, p2, format, log } = data
  const logs = log.split('\n')
  let isWinnerP1 = false
  const team1: string[] = []
  const team2: string[] = []
  const team1SentOut: Pokemon[] = []
  const team2SentOut: Pokemon[] = []
  const currentPokemons: { [key: string]: Pokemon } = {}
  for (const line of logs) {
    const args = line.split('|')
    const argc = args.length
    if (argc < 2 || args[1] === '') {
      continue
    }
    const command = args[1]
    switch (command) {
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
    id,
    password,
    p1,
    p2,
    format,
    timeParsed: Math.floor(Date.now() / 1000),
    isWinnerP1,
    team1,
    team2,
    team1SentOut,
    team2SentOut,
    remarks: ''
  }
}

export default defineComponent({
  components: { ReplayPokemonCard },
  name: 'ReplayParserPage',
  setup: () => {
    const urlText = ref('')
    const bar = ref<QAjaxBar>()
    const tab = ref<string>()
    const replay = ref<ParsedBattle>()
    const remarksText = ref('')

    const parse = async () => {
      const barRef = bar.value
      if (!barRef) {
        return
      }
      barRef.start()
      try {
        const url = urlText.value
        const replayJSON = await fetch(url + '.json')
        const data = await replayJSON.json()
        const parsed = parseReplay(data)
        console.log(parsed)
        replay.value = parsed
        tab.value = parsed.isWinnerP1 ? 'p2' : 'p1'
      } catch {
        alert('Something went wrong.')
      } finally {
        barRef.stop()
      }
    }

    const getCardPokemons = (isPlayer2: boolean): Pokemon[] => {
      const r = replay.value
      if (!r) {
        return []
      }
      const pokes: Pokemon[] = []
      const sentOut: string[] = []
      for (const poke of isPlayer2 ? r.team2SentOut : r.team1SentOut) {
        pokes.push(poke)
        sentOut.push(poke.id)
      }
      for (const poke of isPlayer2 ? r.team2 : r.team1) {
        let o = false
        for (const each of sentOut) {
          if (
            poke.endsWith('*') && each.startsWith(poke.slice(0, -1)) ||
            sentOut.includes(poke)
          ) {
            o = true
            break
          }
        }
        if (!o) {
          pokes.push({ id: poke, moves: [] })
        }
      }
      return pokes
    }

    const save = () => {
      const parsed = replay.value
      if (!parsed) {
        return
      }
      parsed.remarks = remarksText.value
      saveBattle(parsed)
      console.log('Saved')
    }

    return {
      urlText,
      bar,
      parse,
      replay,
      tab,
      getCardPokemons,
      remarksText,
      save,
    }
  },
})
</script>
