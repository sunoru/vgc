<template>
  <q-page class="row items-center justify-evenly">
    <div class="q-pa-md col" style="max-width: 720px">
      <div class="text-h3">Settings</div>
      <q-form class="q-mt-md" @submit="save">
        <q-toggle disable v-model="useLocalStorage" label="Use Local Storage" />
        <q-input
          label="My Usernames (Separated by commas)"
          v-model="textMyUsernames"
          filled
          type="textarea"
        />
        <q-btn class="q-mt-md" type="submit" label="Save" />
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { getConfig, saveConfig, useLocalStorage } from '../utils/storage'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'SettingsPage',
  setup() {
    const textMyUsernames = ref('')
    const save = async () => {
      const config = await getConfig()
      config.myUsernames = textMyUsernames.value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s)
      await saveConfig(config)
    }
    onMounted(async () => {
      const c = await getConfig()
      textMyUsernames.value = c.myUsernames.join(',')
    })
    return {
      textMyUsernames,
      save,
      useLocalStorage,
    }
  },
})
</script>
