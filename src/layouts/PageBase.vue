<template>
  <q-page>
    <slot />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{
  title?: string
}>()

onMounted(() => {
  document.title = (props.title ? `${props.title} - ` : '') + 'VGC Tools'
})
</script>
