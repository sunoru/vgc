<template>
  <q-form>
    <q-form @submit="exec" class="q-mt-md">
      <q-select
        v-model="selected"
        label="Scripts"
        :options="options"
        emit-value
        map-options
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        @new-value="createScript"
      />

      <codemirror
        v-model="script.code"
        :placeholder="placeholder || 'Code goes here...'"
        :style="{ height: '200px' }"
        autofocus
        :tabSize="2"
        :extensions="codemirrorExtensions"
        :spellcheck="false"
        @keydown="onKeyDown"
        @change="onChange"
      />
      <q-btn
        class="q-mt-sm"
        color="primary"
        label="Save"
        @click="save"
        :loading="isSaving"
      >
        <template v-slot:loading>
          <q-spinner-dots />
        </template>
      </q-btn>
      <q-input v-model="args" label="Arguments" />
      <q-btn
        class="q-mt-sm"
        color="primary"
        :label="submitString ?? 'Execute'"
        type="submit"
      />
    </q-form>
  </q-form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QSelectProps } from 'quasar'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { v4 as uuidv4 } from 'uuid'

import { ScriptSnippet } from '../utils/scripts'

const codemirrorExtensions = [javascript(), oneDark]

const props = defineProps<{
  type: ScriptSnippet['type']
  scriptSnippets: ScriptSnippet[]
  submitString?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'save', script: ScriptSnippet): Promise<void>
  (e: 'execute', script: ScriptSnippet, args: unknown): void
}>()

const newScriptName = ref('')
const allOptions = computed(() => {
  const os = props.scriptSnippets.map((snippet, i) => ({
    label: snippet.name,
    value: i,
  }))
  if (newScriptName.value) {
    os.push({
      label: newScriptName.value,
      value: -1,
    })
  }
  return os
})

const options = ref(allOptions)
const selected = ref<number | null>(null)
const script = ref<ScriptSnippet>({
  type: props.type,
  key: uuidv4(),
  name: '',
  code: '',
})
const args = ref('')

watch(
  () => selected.value,
  (v) => {
    console.log(v)
    if (v === null || v < 0) return
    script.value = props.scriptSnippets[v]
    if (!script.value.code.endsWith('\n')) {
      script.value.code += '\n'
    }
  }
)

const onKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault()
    save()
  }
}

const isSaving = ref(false)

const save = async () => {
  if (isSaving.value) return
  try {
    isSaving.value = true
    if (script.value === undefined) return
    await emit('save', script.value)
  } finally {
    isSaving.value = false
  }
}

const exec = () => {
  if (script.value === undefined) return
  const t = args.value.trim()
  emit('execute', script.value, t === '' ? undefined : JSON.parse(args.value))
}

// const filterFunc: QSelectProps['onFilter'] = (val, update) => {
//   update(() => {
//     const needle = val.toLowerCase()
//     options.value = allOptions.value.filter(
//       (v) => v.label.toLowerCase().indexOf(needle) > -1
//     )
//   })
// }
const createScript: QSelectProps['onNewValue'] = (val) => {
  if (!val) return
  const key = (script.value.key = uuidv4())
  if (val === '@new') {
    val = `New Script - ${key.slice(0, 8)}`
  }
  newScriptName.value = val
  selected.value = -1
}
const onChange = () => {
  if (!newScriptName.value) {
    createScript('@new', () => void 0)
  }
}
</script>
