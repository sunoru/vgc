<template>
  <page-base class="row items-top justify-evenly" title="Miscellaneous">
    <q-card class="col">
      <q-splitter v-model="splitterModel">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical class="text-teal">
            <q-tab name="cp-tiers" icon="list" label="CP Tiers" />
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="cp-tiers">
              <div class="q-pa-md">
                <q-input v-model="cpTiers.input" filled autogrow label="CSV data (format: cp,paste)" />
                <q-btn
                  class="q-mt-md"
                  color="primary"
                  label="Import All"
                  type="submit"
                  @click="cpTiers.action"
                  :loading="cpTiers.loading"
                />
                <q-input class="q-mt-md" v-model="cpTiers.output" filled autogrow label="Output" readonly />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card>
  </page-base>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { getCPTiers } from 'vgc-tools'

import PageBase from '../layouts/PageBase.vue'

const splitterModel = ref(20)
const tab = ref('')
const cpTiers = ref({
  input: '',
  loading: false,
  action: async () => {
    cpTiers.value.loading = true
    const input = cpTiers.value.input.split('\n').map((line) => {
      const [cp, pasteUrl] = line.split(',')
      return { cp: Number(cp), pasteUrl }
    })
    try {
      const output = await getCPTiers(input)
      cpTiers.value.output = output.map((tier) => `${tier.cp}: ${tier.pokes.join(', ')}`).join('\n')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      cpTiers.value.output = err.toString()
    }
    cpTiers.value.loading = false
  },
  output: '',
})
</script>
