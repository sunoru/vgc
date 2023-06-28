<template>
  <page-base class="row items-center justify-evenly" title="Settings">
    <div class="q-pa-md col" style="max-width: 720px">
      <div class="text-h3">Settings</div>
      <q-form class="q-mt-md" @submit="save">
        <div>
          <q-toggle disable v-model="config.useLocalStorage" label="Use Local Storage" />
        </div>
        <div>
          <q-toggle v-model="config.darkMode" label="Dark Mode" />
        </div>
        <q-input
          label="My Usernames (Separated by linebreaks)"
          v-model="textMyUsernames"
          filled
          type="textarea"
        />
        <q-btn class="q-mt-md" color="primary" type="submit" label="Save" :loading="isSaving" />
      </q-form>
    </div>
  </page-base>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import PageBase from '../layouts/PageBase.vue'
import { useConfigStore } from '../stores/config'

const config = useConfigStore().config
const textMyUsernames = ref('')
const isSaving = ref(true)
const save = () => {
  if (isSaving.value) return
  isSaving.value = true
  config.showdownUsernames = textMyUsernames.value
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s)
  setTimeout(() => {
    isSaving.value = false
  }, 500)
}
onMounted(() => {
  textMyUsernames.value = config.showdownUsernames.join('\n')
  isSaving.value = false
})
</script>
