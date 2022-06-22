<template>
  <router-view />
</template>

<script setup lang="ts">
import Immutable from 'immutable'
import * as db from './utils/db'
import { PlayerNumber } from './utils/models'
import * as storage from './utils/storage'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any
w.Immutable = Immutable
w.vgc = {
  db,
  storage,
}
w.PlayerNumber = PlayerNumber
</script>
