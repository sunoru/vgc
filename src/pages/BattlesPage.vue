<template>
  <q-page class="row items-top justify-evenly">
    <div class="q-pa-md col" style="max-width: 1600px">
      <!-- TODO -->
      <q-table
        title="Battles (WIP)"
        class="battle-table"
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
              <a style="color: inherit; text-decoration: none;" :href="props.row.url" target="_blank">
                {{ props.row.id }}
              </a>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script lang="ts">
import { ParsedBattle } from '../utils/models'
import { getAllSavedBattles } from '../utils/storage'
import { defineComponent, onMounted, ref } from 'vue'
import { QTableColumn } from 'quasar'

const DefaultColumns: QTableColumn[] = [
  {
    name: 'id',
    label: 'ID',
    field: 'id'
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
    return {
      columns,
      rows,
      pagination: ref({
        rowsPerPage: 0,
      }),
    }
  },
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
