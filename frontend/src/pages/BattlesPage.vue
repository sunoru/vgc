<template>
  <page-base class="row items-top justify-evenly" title="Battles (WIP)">
    <div class="q-pa-md col">
      <q-expansion-item class="col" style="width: 100%" label="Actions" v-model="actionsExpanded">
        <q-splitter v-model="splitterModel" style="height: 748px; width: 100%">
          <template v-slot:before>
            <q-tabs v-model="tab" vertical>
              <q-tab name="filters" icon="filter_alt" label="Filters" />
              <q-tab name="analytics" icon="analytics" label="Analytics" />
              <q-route-tab
                href="https://github.com/sunoru/vgc/blob/main/src/utils/models.ts"
                icon="source"
                label="Model Reference"
                target="_blank"
              />
              <q-route-tab
                href="https://github.com/sunoru/vgc/blob/main/scripts/helpers.ts"
                icon="help_center"
                label="Helper Functions"
                target="_blank"
              />
              <q-route-tab icon="file_upload" label="Import All Data">
                <template v-slot>
                  <q-file v-model="fileToUpload" filled style="width: 100%; position: absolute; opacity: 0" />
                </template>
              </q-route-tab>
              <q-route-tab icon="file_download" label="Export All Data" @click="onExport" />
              <q-route-tab icon="file_download" label="Export Table (CSV)" @click="onExportTable" />
              <q-route-tab>
                <template v-slot>
                  <q-toggle v-model="extendedFields" label="Extended Fields" />
                </template>
              </q-route-tab>
            </q-tabs>
          </template>
          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
            </q-tab-panels>
          </template>
        </q-splitter>
      </q-expansion-item>

      <q-table
        :title="tableTitle"
        class="battle-table q-mt-md"
        table-header-class="battle-table-header"
        :rows="rows"
        :columns="columns"
        separator="cell"
        row-key="id"
        bordered
        virtual-scroll
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="searching" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-time="props">
          <q-td :props="props">
            <a style="color: inherit; text-decoration: none" :href="props.row.url" target="_blank">
              {{ props.value }}
            </a>
          </q-td>
        </template>
        <template v-slot:body-cell-result="props">
          <q-td :props="props">
            <q-chip :color="props.value === 'Win' ? 'light-green-8' : 'orange-8'" :label="props.value" />
          </q-td>
        </template>
        <template v-slot:body-cell-tags="props">
          <q-td :props="props">
            <q-chip v-for="(tag, i) in props.value" :key="i" color="teal-8" :label="tag" />
          </q-td>
        </template>
        <template v-slot:body-cell-remarks="props">
          <q-td :props="props" style="width: 100%; min-height: 24px">
            <span v-for="(line, i) in props.value.split('\n')" :key="i">
              <br v-if="i > 0" />
              {{ line }}
            </span>
            <q-popup-edit
              v-model="props.row.remarks"
              v-slot="scope"
              buttons
              @save="onSaveEdited(props.row, props.col)"
            >
              <q-input type="textarea" v-model="scope.value" counter @keyup.enter.stop />
            </q-popup-edit>
          </q-td>
        </template>
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <div v-if="['team1', 'team2'].includes(props.col.name)">
              <q-chip
                v-for="([sentOut, poke], i) in props.value"
                :key="i"
                :label="(sentOut > 0 ? sentOut + ' ' : '') + poke"
                :color="sentOut > 0 ? 'purple' : ''"
              />
            </div>
            <span v-else>
              {{ props.value }}
            </span>
          </q-td>
        </template>
      </q-table>
    </div>
  </page-base>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { QTableProps, exportFile } from 'quasar'

import { type ParsedBattle, PlayerNumber } from 'vgc-tools'

import PageBase from '../layouts/PageBase.vue'
import { loadBattles } from '../utils/battles'
import { getDB } from '../utils/db'
import { useConfigStore } from '../stores/config'
import { showDialog } from '../utils/dialog'
import { saveObject, saveObjects } from '../utils/storage'

const extendedFields = ref(false)

const getTeamCell = (battle: ParsedBattle, isTeam1: boolean): Array<readonly [number, string]> => {
  const player = isTeam1 ? battle.getPlayer() : battle.getOpponent()
  return player.team.map((poke) => {
    const sentOutIndex = player.sentOut.findIndex((p) => p.id === poke)
    return [sentOutIndex + 1, poke] as const
  })
}
const DefaultColumns: QTableProps['columns'] = [
  {
    name: 'time',
    label: 'Time',
    field: 'time',
    format: (val: number) => new Date(val * 1000).toLocaleString(),
    sortable: true,
  },
  {
    name: 'opponent',
    label: 'Opponent',
    field: (battle: ParsedBattle) =>
      battle.userPlayer === PlayerNumber.Unknown ? `${battle.p1}, ${battle.p2}` : battle.getOpponent().name,
  },
  {
    name: 'rating',
    label: 'Rating',
    field: (battle: ParsedBattle) =>
      battle.rating
        ? `${battle.rating} (${battle.getOpponent().rating})`
        : battle.getOpponent().rating.toString(),
    sortable: true,
  },
  {
    name: 'result',
    label: 'Result',
    field: (battle: ParsedBattle) =>
      battle.userPlayer === PlayerNumber.Unknown
        ? 'N/A'
        : battle.userPlayer === battle.winner
        ? 'Win'
        : 'Lose',
  },
  {
    name: 'team1',
    label: 'Team 1',
    field: (battle: ParsedBattle) => getTeamCell(battle, true),
  },
  {
    name: 'team2',
    label: 'Team 2',
    field: (battle: ParsedBattle) => getTeamCell(battle, false),
  },
  {
    name: 'remarks',
    label: 'Remarks',
    field: (battle: ParsedBattle) => battle.remarks || '',
    style: 'text-align: left;',
  },
  {
    name: 'tags',
    label: 'Tags',
    field: 'tags',
  },
]
const ExtendedColumns: QTableProps['columns'] = DefaultColumns.concat([
  {
    name: 'userPlayer',
    label: 'User Player',
    field: (battle: ParsedBattle) => battle.getPlayer().name,
  },
  {
    name: 'platform',
    label: 'Platform',
    field: 'platform',
  },
  {
    name: 'id',
    label: 'ID',
    field: 'id',
  },
])

const data = ref<ParsedBattle[]>([])

onMounted(async () => {
  data.value = await loadBattles()
})
const pagination = ref({
  rowsPerPage: 0,
})
const splitterModel = ref(20)
const tab = ref('filters')
const searching = ref('')
const actionsExpanded = ref(false)
const tableTitle = computed(() => `Battles (${rows.value.length}/${data.value.length})`)

const applyFilters = (arr: unknown[]) => {
  // TODO: custom filters
  const battles = arr as ParsedBattle[]
  return battles.filter((x) => {
    return x.id.startsWith('gen9vgc2023regulatione')
  })
}
const applySearch = (arr: unknown[]) => {
  if (!searching.value) return arr
  const key = searching.value.trim().toLowerCase()
  if (!key) return arr
  return arr.filter((x) =>
    Object.values(x as Record<string, unknown>).some((v) => String(v).toLowerCase().includes(key)),
  )
}
const rows = computed(() => applyFilters(applySearch(data.value)))
const columns = computed(() => (extendedFields.value ? ExtendedColumns : DefaultColumns))

const fileToUpload = ref<File>()

type ExportedFile = {
  usernames: string[]
  battles: ParsedBattle[]
}

const config = useConfigStore().config

watch(
  () => fileToUpload.value,
  (v) => {
    if (!v) return
    fileToUpload.value = undefined
    const reader = new FileReader()
    reader.onload = async (ev) => {
      if (!ev.target) return
      const { result } = ev.target
      if (!result) return
      const { usernames, battles } = JSON.parse(result as string) as Partial<ExportedFile>
      if (usernames) {
        usernames.forEach((x) => {
          if (!config.showdownUsernames.includes(x)) {
            config.showdownUsernames.push(x)
          }
        })
      }
      if (battles) {
        await saveObjects('battles', battles)
      }
      showDialog('Import completed')
      window.location.reload()
    }
    reader.readAsText(v)
  },
)

const onExport = async () => {
  const db = getDB()
  const data = {
    usernames: config.showdownUsernames,
    battles: await db.battles.toArray(),
  }
  const s = JSON.stringify(data)
  exportFile('data.json', s)
}
function wrapCsvValue<T>(val: string, formatFn?: (x: string, row?: T) => string, row?: T) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val

  formatted = formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')
  return `"${formatted}"`
}
const onExportTable = async () => {
  if (!columns.value) return
  const cols = columns.value
  const content = [cols.map((col) => wrapCsvValue(col.label))]
    .concat(
      rows.value.map((row) =>
        cols
          .map((col) =>
            wrapCsvValue(
              typeof col.field === 'function'
                ? col.field(row)
                : row[(col.field === void 0 ? col.name : col.field) as keyof ParsedBattle],
              col.format,
              row,
            ),
          )
          .join(','),
      ),
    )
    .join('\r\n')

  const status = exportFile('table-export.csv', content, {
    mimeType: 'text/csv',
    byteOrderMark: '\uFEFF',
  })

  if (status !== true) {
    showDialog('Browser denied file download...', 'negative', {
      icon: 'warning',
    })
  }
}

const onSaveEdited = async (edited: ParsedBattle, column?: { name: string }) => {
  try {
    await saveObject('battles', edited)
    const message = column ? `${column.name} updated` : 'Battle updated'
    showDialog(message)
  } catch (e) {
    console.error(e)
    showDialog(`Error saving battle: ${(e as { message: string }).message}`, 'negative', { icon: 'warning' })
  }
}
</script>
