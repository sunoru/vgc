<template>
  <router-view />
</template>

<script setup lang="ts">
import Immutable from 'immutable'

window.Immutable = Immutable
// import { helpers } from '@sunoru/vgc-base'
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// ;(window as any).vgc = {
//   helpers,
// }
</script>
