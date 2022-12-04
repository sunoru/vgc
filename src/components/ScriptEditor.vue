<template>
  <q-form>
    <codemirror
      v-model="code"
      placeholder="Code goes here..."
      :style="{ height: '400px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      @ready="handleReady"
      @change="log('change', $event)"
      @focus="log('focus', $event)"
      @blur="log('blur', $event)"
      spellcheck="false"
      mode="{name: 'javascript', typescript: true}"
    />
  </q-form>
</template>

<script setup lang="ts">
import { shallowRef, ref } from 'vue'
import { EditorView } from 'codemirror'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { getDB } from '../utils/db'

const extensions = [javascript({ typescript: true }), oneDark]
const emptyScript = '(...args: any[]) => true'
const db = getDB()

const code = ref(emptyScript)
const view = shallowRef<EditorView>()
const handleReady = ({ view: v }: { view: EditorView }) => {
  view.value = v
}

const log = (...args: any[]) => console.log(...args)
</script>
