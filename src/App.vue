<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import * as config from './utils/config'
import * as dialog from './utils/dialog'
import * as helpers from './utils/helpers'
import * as models from './utils/models'
import * as scripts from './utils/scripts'
import * as storage from './utils/storage'
import Immutable from 'immutable'
import { exportFile } from 'quasar'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).vgc = {
  config,
  dialog,
  helpers,
  models,
  scripts,
  storage,
  Immutable,
  exportFile,
}

export default defineComponent({
  name: 'App',
})
</script>
