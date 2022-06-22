<template>
  <q-form>
    <q-form @submit="exec" class="q-mt-md">
      <q-select
        :disable="disable"
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
        :disable="disable"
        :placeholder="placeholder || 'Code goes here...'"
        :style="{ height: '500px' }"
        autofocus
        :tabSize="2"
        :extensions="codemirrorExtensions"
        :spellcheck="false"
        @keydown="onKeyDown"
        @change="onChange"
      />
      <q-btn
        :disable="disable"
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
      <q-btn
        :disable="disable"
        class="q-mt-sm q-ml-sm"
        color="primary"
        label="Delete"
        @click="onDelete"
        :loading="isSaving"
      >
        <template v-slot:loading>
          <q-spinner-dots />
        </template>
      </q-btn>
      <q-input v-model="args" label="Arguments" autocomplete />
      <q-btn
        :disable="disable"
        class="q-mt-sm"
        color="primary"
        :label="submitString ?? 'Execute'"
        type="submit"
      />
    </q-form>
  </q-form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { QSelectProps } from 'quasar'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { v4 as uuidv4 } from 'uuid'

import { ScriptSnippet } from '../utils/scripts'
import { confirmDialog } from '../utils/dialog'
import { clone } from '../utils/utils'

const codemirrorExtensions = [javascript(), oneDark]

const props = defineProps<{
  type: ScriptSnippet['type']
  scriptSnippets: ScriptSnippet[]
  defaultScript?: string
  disable?: boolean
  submitString?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'save', script: ScriptSnippet): Promise<void>
  (e: 'delete', script: ScriptSnippet): Promise<void>
  (e: 'execute', script: ScriptSnippet, args: unknown[]): Promise<void>
}>()

const newScript = ref<ScriptSnippet>()
const allOptions = computed(() => {
  const os = props.scriptSnippets.map((snippet, i) => ({
    label: snippet.name,
    value: i,
  }))
  if (newScript.value) {
    os.push({
      label: newScript.value.name,
      value: -1,
    })
  }
  return os
})

const options = ref(allOptions)
const selected = ref(-1)
const script = ref<ScriptSnippet>({
  type: props.type,
  id: uuidv4(),
  name: '',
  code: '',
  isDefault: true,
})
const args = ref('')

watch(
  () => [selected.value, props.scriptSnippets.length] as const,
  ([v], [oldV]) => {
    if (v < 0) {
      if (newScript.value) {
        script.value = newScript.value
      }
      return
    }
    if (oldV === -1 && newScript.value) {
      newScript.value = script.value
    }
    if (v < props.scriptSnippets.length) {
      script.value = clone(props.scriptSnippets[v])
      if (!script.value.code.endsWith('\n')) {
        script.value.code += '\n'
      }
    }
  }
)
onMounted(() => void (selected.value = 0))

const onKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault()
    save()
  } else if (e.ctrlKey && e.key === 'e') {
    e.preventDefault()
    exec()
  }
}

const isSaving = ref(false)

const save = async () => {
  if (isSaving.value) return
  try {
    isSaving.value = true
    if (script.value === undefined) return
    const toSave = clone(script.value)
    await emit('save', toSave)
    newScript.value = undefined
  } finally {
    isSaving.value = false
  }
}

const onDelete = async () => {
  if (isSaving.value) return
  try {
    isSaving.value = true
    if (script.value === undefined) return
    if (!(await confirmDialog(`Sure to delete "${script.value.name}"?`))) return
    const toDelete = clone(script.value)
    if (script.value === newScript.value) {
      newScript.value = undefined
      selected.value = 0
      return
    }
    await emit('delete', toDelete)
    selected.value = 0
  } finally {
    isSaving.value = false
  }
}

const exec = () => {
  if (script.value === undefined) return
  const t = args.value.trim()
  emit('execute', script.value, t === '' ? [] : JSON.parse(`[${args.value}]`))
}

const createScript: QSelectProps['onNewValue'] = (val) => {
  val = val.trim()
  if (!val) return
  const key = (script.value.id = uuidv4())
  if (val === '@new') {
    val = `New Script - ${key.slice(0, 8)}`
  }
  newScript.value = clone(script.value)
  script.value = newScript.value
  if (newScript.value.code.trim() === '') {
    newScript.value.code = props.defaultScript || ''
  }
  newScript.value.isDefault = false
  newScript.value.name = val
  selected.value = -1
}

const onChange = () => {
  if (script.value.isDefault && !newScript.value) {
    createScript('@new', () => void 0)
  }
}
</script>
