<template>
  <page-base class="row items-top justify-evenly" title="Speed Tiers">
    <div class="q-pa-md col">
      <div>
        {{ FormatIDs }}
      </div>
      <q-table
        title="Speed Tiers"
        :rows="rows"
        :columns="columns"
        separator="cell"
        row-key="speed"
        bordered
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
      >
      </q-table>
    </div>
  </page-base>
</template>

<script setup lang="ts">
import type { ID } from '@pkmn/sim'
import { QTable, QTableProps } from 'quasar'
import { computed, ref } from 'vue'
import { BattleTeambuilderTable, VGCBattleTeambuilderData } from '../data/teambuilder-tables.cjs'
import { Dex } from '../utils/dex'

import PageBase from '../layouts/PageBase.vue'

const columns: QTableProps['columns'] = [
  {
    name: 'speed',
    label: 'Speed',
    field: 'speed',
    sortable: true,
  },
  {
    name: 'pokes',
    label: 'Pokemons',
    field: 'pokes',
    format: (val: string[]) => val.join(', '),
  },
]
const FormatIDs = Object.keys(BattleTeambuilderTable)
const format = ref('gen9vgc')
const table = BattleTeambuilderTable[format.value] as VGCBattleTeambuilderData
const pokes = table.tiers.slice(table.formatSlices.Regular + 1, table.formatSlices.NFE) as unknown as ID[]
const dex = Dex.forGen(9)

const rows = computed(() => {
  const data = new Map<number, string[]>()
  for (const p of pokes) {
    const s = dex.species.get(p)
    const spe = s.baseStats.spe
    if (!data.has(spe)) data.set(spe, [])
    data.get(spe)!.push(s.name)
  }
  return Array.from(data.entries()).map(([speed, pokes]) => ({ speed, pokes }))
})
const pagination = ref({
  rowsPerPage: 0,
})
</script>
