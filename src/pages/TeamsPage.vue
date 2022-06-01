<template>
  <page-base class="row items-center justify-evenly" title="Replay Importer">
    <q-ajax-bar
      ref="bar"
      position="top"
      color="accent"
      size="10px"
      skip-hijack
    />
    <div class="q-pa-md col" style="max-width: 720px">
      <div class="text-h3">Teams</div>
      <q-form @submit="importTeams" class="q-mt-md">
        <q-input
          outlined
          v-model="textInput"
          label=""
          autogrow
          type="textarea"
        />
        <q-btn
          class="q-mt-sm"
          color="primary"
          label="Import All"
          type="submit"
          :loading="isImporting"
        />
      </q-form>
    </div>
  </page-base>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageBase from '../layouts/PageBase.vue'

const importTeams = () => void 0
const textInput = ref('')
const isImporting = ref(false)
</script>
