<template>
  <q-card v-for="(poke, index) in pokemons" class="poke-card" :key="index">
    <q-card-section class="bg-secondary text-white">
      <div class="text-h6">{{ poke.id }}</div>
      <div class="row justify-between">
        <div class="text-subtitle2">{{ poke.ability }}</div>
        <div class="text-subtitle2 text-right">{{ poke.item }}</div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-actions align="around">
      <q-btn v-for="(move, index) in poke.moves" :key="index" flat no-caps>
        {{ move }}
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ReplayPokemonCard',
  props: {
    pokemons: {
      type: Array,
      required: true,
    },
  },
})
</script>

<style scoped>
.poke-card {
  margin-top: 20px;
  width: 100%;
  max-width: 300px;
}
</style>
