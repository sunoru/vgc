<template>
  <q-page>
    <slot />
  </q-page>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'

const props = defineProps<{
  title?: string
}>()

const setTitle = () => {
  document.title = (props.title ? `${props.title} - ` : '') + 'VGC Tools'
}
onMounted(setTitle)
watch(() => props.title, setTitle)

</script>
