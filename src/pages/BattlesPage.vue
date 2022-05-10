<template>
  <q-page class="row items-center justify-evenly">
    <div class="text-h3">WIP.</div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'BattlesPage',
  setup: () => {
    const battles = ref([])
    return { battles }
  }
})
</script>
