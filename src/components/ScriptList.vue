<template>
  <q-list bordered padding>
    <q-item tag="label" v-ripple @click="() => dialog = true">
      <q-item-section side top>
        <q-checkbox v-model="check1" />
      </q-item-section>

      <q-item-section>
        <q-item-label>Notifications</q-item-label>
        <q-item-label caption>
          Notify me about updates to apps or games that I downloaded
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <q-dialog v-model="dialog" persistent>
    <q-card style="width: 1280px; max-width: 80vw;">
      <!-- <q-card-section class="row items-center">
        </q-card-actions> -->
      <script-editor />
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import ScriptEditor from './ScriptEditor.vue'

const check1 = ref(true)
const dialog = ref(false)

</script>

