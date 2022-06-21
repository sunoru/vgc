<template>
  <page-base class="row items-top justify-evenly" title="Battles (WIP)">
    <div class="q-pa-md col" style="max-width: 1600px">
      <!-- TODO -->
      <div class="row">
        <q-splitter v-model="splitterModel" style="height: 480px; width: 100%">
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
              <q-tab-panel name="filters">
                <script-input type="filter" :script-snippets="filterScripts" />
              </q-tab-panel>

              <q-tab-panel name="analytics">
                <script-input
                  type="analyzer"
                  :script-snippets="analyzerScripts"
                />
              </q-tab-panel>
            </q-tab-panels>
          </template>
        </q-splitter>
      </div>

      <q-table
        title="Battles"
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
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="id" :props="props">
              <a
                style="color: inherit; text-decoration: none"
                :href="props.row.url"
                target="_blank"
              >
                {{ props.row.id }}
              </a>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </page-base>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { QTableProps } from 'quasar'
import { ParsedBattle } from '../utils/models'
import { defaultAnalyzers, defaultFilters } from '../utils/scripts'

import { getAllSavedBattles } from '../utils/storage'

import PageBase from '../layouts/PageBase.vue'
import ScriptInput from '../components/ScriptInput.vue'

const DefaultColumns: QTableProps['columns'] = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
  },
]

export default defineComponent({
  name: 'BattlesPage',
  setup: () => {
    const columns = ref(DefaultColumns)
    const rows = ref<ParsedBattle[]>([])
    onMounted(async () => {
      rows.value = Array.from(Object.values(await getAllSavedBattles()))
    })
    const filterScripts = ref(defaultFilters)
    const analyzerScripts = ref(defaultAnalyzers)
    return {
      columns,
      rows,
      pagination: ref({
        rowsPerPage: 0,
      }),
      filterScripts,
      analyzerScripts,
      splitterModel: ref(20),
      tab: ref('filters'),
    }
  },
  components: { ScriptInput, PageBase },
})
</script>

<style lang="scss">
.battle-table {
  max-height: 720px;
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
