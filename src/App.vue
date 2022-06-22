<template>
  <router-view />
</template>

<script setup lang="ts">
import Immutable from 'immutable'
import * as db from './utils/db'
import * as storage from './utils/storage'

window.Immutable = Immutable
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).vgc = {
  db,
  storage,
}
</script>
