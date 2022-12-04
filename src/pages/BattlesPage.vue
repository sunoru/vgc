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
                  <q-toggle
                    v-model="extendedFields"
                    :disable="analyzer !== undefined"
                    label="Extended Fields"
                  />
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

      <div class="q-mt-sm q-gutter-xs">
        <q-chip
          v-for="(filter, i) in filters"
          :key="i"
          :label="getChipLabel(filter.script, filter.args)"
          color="primary"
          removable
          @remove="onRemoveFilter(filter)"
        />
        <q-chip
          v-if="analyzer"
          :label="getChipLabel(analyzer.script, analyzer.args)"
          color="green"
          removable
          @remove="onRemoveAnalyzer"
        />
      </div>

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
                :color="sentOut > 0 ? (RestrictedPokemons.includes(poke) ? 'pink' : 'purple') : ''"
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

<style lang="scss">
.battle-table {
  max-height: 900px;
}

.battle-table-header {
  position: sticky;
  z-index: 1;
  top: 0;
}

.battle-table > div:nth-child(1),
.battle-table-header {
  background-color: #fff;
}

.body--dark .battle-table > div:nth-child(1),
.body--dark .battle-table-header {
  background-color: #121212;
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { exportFile, QTableProps } from 'quasar'
import { ParsedBattle, PlayerNumber } from '../utils/models'
import { defaultAnalyzers, defaultFilters, ScriptSnippet } from '../utils/scripts'

import { deleteObject, getAllSavedObjects, saveObject, saveObjects } from '../utils/storage'

import PageBase from '../layouts/PageBase.vue'
import { showDialog } from '../utils/dialog'
import { clone } from '../utils/utils'
import { getOpponent, getPlayer, normalizeName } from '../../scripts/helpers'
import { RestrictedPokemons } from '../../scripts/consts'
import { getConfig, saveConfig } from '../utils/config'
import { getDB } from '../utils/db'

export type Filter = {
  func: (battle: ParsedBattle) => boolean
  script: ScriptSnippet
  args: unknown[]
}
export type Analyzer = {
  func: (battles: ParsedBattle[]) => unknown
  script: ScriptSnippet
  args: unknown[]
}

const extendedFields = ref(false)

const getTeam = (battle: ParsedBattle, isUserPlayer: boolean): Array<readonly [number, string]> => {
  const player =
    battle.userPlayer === PlayerNumber.None
      ? isUserPlayer
        ? getPlayer(battle, PlayerNumber.Player1)
        : getPlayer(battle, PlayerNumber.Player2)
      : isUserPlayer
      ? getPlayer(battle, battle.userPlayer)
      : getOpponent(battle)
  return player.team.toArray().map((poke) => {
    const sentOutIndex = player.sentOut.findIndex((p) => normalizeName(p.id) === poke)
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
      battle.userPlayer === PlayerNumber.None ? `${battle.p1}, ${battle.p2}` : getOpponent(battle).name,
  },
  {
    name: 'rating',
    label: 'Rating',
    field: 'rating',
    sortable: true,
  },
  {
    name: 'result',
    label: 'Result',
    field: (battle: ParsedBattle) =>
      battle.userPlayer === PlayerNumber.None ? 'N/A' : battle.userPlayer === battle.winner ? 'Win' : 'Lose',
  },
  {
    name: 'team1',
    label: 'Team 1',
    field: (battle: ParsedBattle) => getTeam(battle, true),
  },
  {
    name: 'team2',
    label: 'Team 2',
    field: (battle: ParsedBattle) => getTeam(battle, false),
  },
  {
    name: 'remarks',
    label: 'Remarks',
    field: 'remarks',
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
    field: (battle: ParsedBattle) => getPlayer(battle, battle.userPlayer).name,
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
const IgnoredColumns = ['url', 'log', 'userPlayer']

const getChipLabel = (script: ScriptSnippet, args: unknown[]) => {
  const label = script.name
  return args.length === 0 ? label : `${label} (${args.join(', ')})`
}

const data = ref<ParsedBattle[]>([])
const filterScripts = ref<ScriptSnippet[]>([])
const analyzerScripts = ref<ScriptSnippet[]>([])
const mounted = ref(false)
onMounted(async () => {
  const battles = await getAllSavedObjects('battles')
  data.value = Array.from(Object.values(battles))
  const scripts = Array.from(Object.values(await getAllSavedObjects('scripts')))
  filterScripts.value = [...defaultFilters, ...scripts.filter((x) => x.type === 'filter')]
  analyzerScripts.value = [...defaultAnalyzers, ...scripts.filter((x) => x.type === 'analyzer')]
  mounted.value = true
})
const pagination = ref({
  rowsPerPage: 0,
})
const splitterModel = ref(20)
const tab = ref('filters')

const searching = ref('')
const filters = ref<Filter[]>([])
const analyzer = ref<Analyzer>()
const createFunction = <T>(script: ScriptSnippet, args: unknown[]) => {
  try {
    const f = new Function(`return ${script.code}`)()
    const func = (arg0: T) => f(arg0, ...args)
    return func
  } catch (e) {
    showDialog(`Failed to create function:${(e as { message: string }).message}`, 'negative', {
      icon: 'warning',
    })
    throw e
  }
}
const onSaveFilter = async (script: ScriptSnippet) => {
  if (script.isDefault) {
    showDialog('Cannot save default filter', 'negative', { icon: 'warning' })
    return
  }
  console.log(`Saving script ${script.name} (${script.id})`)
  await saveObject('scripts', script)
  if (!filterScripts.value.some((x) => x.id === script.id)) {
    filterScripts.value.push(script)
  }
  showDialog('Filter script saved')
}
const onSaveAnalyzer = async (script: ScriptSnippet) => {
  if (script.isDefault) {
    showDialog('Cannot save default analyzer', 'negative', { icon: 'warning' })
    return
  }
  console.log(`Saving script ${script.name} (${script.id})`)
  await saveObject('scripts', script)
  if (!analyzerScripts.value.some((x) => x.id === script.id)) {
    analyzerScripts.value.push(script)
  }
  showDialog('Analyzer script saved')
}
const onAddFilter = (script: ScriptSnippet, args: unknown[]) => {
  const func = createFunction<ParsedBattle>(script, args)
  filters.value.push({ func, script: clone(script), args: args })
  showDialog(`Filter "${script.name}" added`)
}
const onRemoveFilter = (filter: Filter) => {
  filters.value = filters.value.filter((x) => x !== filter)
  showDialog(`Filter "${filter.script.name}" removed`)
}
const onAnalyze = (script: ScriptSnippet, args: unknown[]) => {
  const func = createFunction<ParsedBattle[]>(script, args)
  analyzer.value = { func, script: clone(script), args: args }
  showDialog(`Analyzer "${script.name}" applied`)
}
const onDeleteFilterScript = async (script: ScriptSnippet) => {
  if (script.isDefault) {
    showDialog('Default scripts cannot be deleted', 'red')
    return
  }
  console.log(`Deleting script ${script.name} (${script.id})`)
  filterScripts.value = filterScripts.value.filter((x) => x.id !== script.id)
  await deleteObject('scripts', script.id)
  showDialog('Filter script deleted')
}
const onDeleteAnalyzerScript = async (script: ScriptSnippet) => {
  if (script.isDefault) {
    showDialog('Default scripts cannot be deleted', 'red')
    return
  }
  console.log(`Deleting script ${script.name} (${script.id})`)
  analyzerScripts.value = analyzerScripts.value.filter((x) => x.id !== script.id)
  await deleteObject('scripts', script.id)
  showDialog('Analyzer script deleted')
}

const onRemoveAnalyzer = () => void (analyzer.value = undefined)

const actionsExpanded = ref(false)

const tableTitle = computed(() => {
  if (analyzer.value) {
    return 'Battle Analytics'
  }
  return `Battles (${rows.value.length}/${data.value.length})`
})

const applySearch = (arr: unknown[]) => {
  if (!searching.value) return arr
  const key = searching.value.trim().toLowerCase()
  if (!key) return arr
  return arr.filter((x) =>
    Object.values(x as Record<string, unknown>).some((v) => String(v).toLowerCase().includes(key))
  )
}
const rows = computed(() => {
  const filtered = filters.value.reduce((acc, filter) => acc.filter(filter.func), data.value)
  if (!analyzer.value) {
    return applySearch(filtered)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analyzed = analyzer.value.func(filtered) as any
  if (Array.isArray(analyzed)) {
    return applySearch(analyzed)
  }
  return applySearch(
    Object.keys(analyzed).map((key) => ({
      key,
      value: analyzed[key],
    }))
  )
})
const columns = computed(() => {
  if (!analyzer.value) {
    if (extendedFields.value) {
      return ExtendedColumns
    }
    return DefaultColumns
  }
  if (rows.value.length === 0) {
    return []
  }
  const x = rows.value[0] as Record<string, unknown>
  return Object.keys(x)
    .map((key) => {
      if (IgnoredColumns.includes(key)) {
        return undefined
      }
      const i = DefaultColumns.findIndex((x) => x.field === key)
      if (i >= 0) {
        return DefaultColumns[i]
      }
      return {
        name: key,
        label: key,
        field: key,
        sortable: true,
      }
    })
    .filter((x) => x !== undefined) as QTableProps['columns']
})

const fileToUpload = ref<File>()

type ExportedFile = {
  usernames: string[]
  scripts: ScriptSnippet[]
  battles: ParsedBattle[]
}

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
      const { usernames, scripts, battles } = JSON.parse(result as string) as Partial<ExportedFile>
      const config = await getConfig()
      if (usernames) {
        usernames.forEach((x) => {
          if (!config.myUsernames.includes(x)) {
            config.myUsernames.push(x)
          }
        })
        await saveConfig(config)
      }
      if (scripts) {
        await saveObjects('scripts', scripts)
      }
      if (battles) {
        await saveObjects('battles', battles)
      }
      showDialog('Import completed')
      window.location.reload()
    }
    reader.readAsText(v)
  }
)
const onExport = async () => {
  const db = getDB()
  const data = {
    usernames: (await getConfig()).myUsernames,
    scripts: await db.scripts.toArray(),
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
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(',')
      )
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
