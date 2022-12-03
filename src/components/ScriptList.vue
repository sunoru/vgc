<template>
  <q-list bordered padding>
    <q-item tag="label" v-ripple>
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const check1 = ref(true)

</script>

