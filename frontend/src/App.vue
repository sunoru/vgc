<template>
  <router-view />
</template>

<script setup lang="ts">
import { getAllSavedObjects } from './utils/storage'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any
w.vgc = {
  getAllSavedObjects
}
</script>
