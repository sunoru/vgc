<template>
  <page-base class="row items-center justify-evenly" title="Settings">
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
  </page-base>
</template>

<script lang="ts">
import { getConfig, saveConfig, LocalConfigs } from '../utils/config'
import { defineComponent, onMounted, ref } from 'vue'
import PageBase from '../layouts/PageBase.vue'

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
      useLocalStorage: ref(LocalConfigs.useLocalStorage),
    }
  },
  components: { PageBase },
})
</script>
