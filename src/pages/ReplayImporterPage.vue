<template>
  <page-base class="row items-center justify-evenly" title="Replay Importer">
    <q-ajax-bar ref="bar" position="top" color="accent" size="10px" skip-hijack />
    <div class="q-pa-md col" style="max-width: 720px">
      <div class="text-h3">Replay Importer</div>
      <q-scroll-area v-if="importingResults.length > 0" style="height: 200px" class="q-mt-md q-gutter-sm">
        <q-tree :nodes="importingResultTree" node-key="key" v-model:expanded="expanded">
          <!-- <template v-slot:default-body="prop">
            <a :href="prop.node.url" target="_blank" class="q-mr-sm">{{ prop.node.label }}</a>
          </template> -->
        </q-tree>
      </q-scroll-area>
      <q-form @submit="submit" class="q-mt-md">
        <q-input outlined v-model="textInput" label="Replay URLs" autogrow type="textarea" />
        <q-btn class="q-mt-md" color="primary" label="Import All" type="submit" :loading="isImporting" />
        <q-btn
          class="q-mt-md q-ml-md"
          color="primary"
          label="Clear Results"
          @click="clearResults"
          :loading="isImporting"
        />
      </q-form>
    </div>
  </page-base>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { QAjaxBar, type QTreeNode } from 'quasar'

import PageBase from '../layouts/PageBase.vue'
import { selectDialog, showDialog } from '../utils/dialog'
import { ParsedBattle, PlayerNumber, importReplay } from 'vgc-tools'
import { getSavedObject, saveObject } from '../utils/storage'
import { useConfigStore } from '../stores/config'

const bar = ref<QAjaxBar>()
const textInput = ref('')
const isImporting = ref(false)

interface ImportingResult {
  battle?: ParsedBattle
  url: string
  skipped?: boolean
  failed?: boolean
}
const importingResults = reactive([] as ImportingResult[])
const clearResults = () => {
  importingResults.splice(0)
}
const importingResultTree = computed(() => {
  const succeeded: QTreeNode[] = []
  const skipped: QTreeNode[] = []
  const failed: QTreeNode[] = []
  for (const x of importingResults) {
    if (x.failed) {
      failed.push({
        key: failed.length,
        label: `${x.url}\t${x.remarks}\t${x.tags.join(',')}`,
      })
    } else if (x.skipped) {
      skipped.push({
        key: skipped.length,
        label: x.battle ? x.battle.id : x.url,
        url: x.url,
      })
    } else if (x.battle) {
      succeeded.push({
        key: succeeded.length,
        label: x.battle.id,
        url: x.url,
      })
    }
  }
  return [
    {
      key: 'succeeded',
      label: `Succeeded (${succeeded.length})`,
      children: succeeded,
    },
    {
      key: 'skipped',
      label: `Skipped (${skipped.length})`,
      children: skipped,
    },
    {
      key: 'failed',
      label: `Failed (${failed.length})`,
      children: failed,
    },
  ] as QTreeNode[]
})
const expanded = ref(['root', 'failed'])

const config = useConfigStore().config
const importOne = async (url: URL, remarks: string, tags: string[]): Promise<ImportingResult> => {
  const matches = url.pathname.match(/^\/(?<id>[0-9a-z]+?-\d+?)(-(?<password>[0-9a-z]+?))?$/)
  const urlString = url.toString()
  if (matches !== null && matches.groups) {
    const id = matches.groups.id
    const existing = await getSavedObject('battles', id)
    if (existing !== null) {
      return {
        battle: existing,
        url: urlString,
        skipped: true,
      }
    }
  }
  try {
    const battle = await importReplay(url.href, {
      remarks,
      tags,
      whichIsUserPlayer: async (p1, p2) => {
        const usernames = config.showdownUsernames
        if (usernames.includes(p1)) return PlayerNumber.Player1
        if (usernames.includes(p2)) return PlayerNumber.Player2
        const p = (await selectDialog('Which is your username?', 'Nither of them', p1, p2)) as PlayerNumber
        if (p !== 0) {
          config.showdownUsernames.push(p === PlayerNumber.Player1 ? p1 : p2)
        }
        return p
      },
    })
    await saveObject('battles', battle)
    return {
      battle,
      url: urlString,
    }
  } catch (e) {
    console.error(e)
    return {
      url: urlString,
      remarks,
      tags,
      failed: true,
    }
  }
}
// input is a tsv string
// url \t remarks \t tags
const importAll = async (input: string): Promise<[number, number]> => {
  const lines = input.split('\n')
  const stepSize = 100 / lines.length
  let succeeded = 0
  let total = 0
  for (let line of lines) {
    bar.value?.increment(stepSize)
    line = line.trim()
    if (line === '') continue
    const [urlString, remarks, tags] = line.split('\t')
    try {
      const url = new URL(urlString)
      total += 1
      const parsed = await importOne(url, remarks, tags?.split(',') || [])
      if (parsed.battle && !parsed.skipped) {
        succeeded += 1
      }
      importingResults.push(parsed)
    } catch (e) {
      console.error(e)
      continue
    }
  }
  return [succeeded, total]
}

const submit = async () => {
  if (!bar.value) return
  isImporting.value = true
  bar.value.start(0)
  try {
    const input = textInput.value.trim()
    if (input === '') {
      showDialog('Invalid input.', 'negative')
      return
    }
    const [succeeded, total] = await importAll(input)
    showDialog(`${succeeded}/${total} Imported.`)
    textInput.value = ''
  } catch (e) {
    console.error(e)
    showDialog('Something went wrong.', 'negative')
  } finally {
    bar.value.stop()
    isImporting.value = false
  }
}
</script>
