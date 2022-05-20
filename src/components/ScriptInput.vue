<template>
  <q-form>
    <q-form @submit="exec" class="q-mt-md">
      <q-select v-model="selected" :options="options" emit-value />
      <q-input
        outlined
        v-model="script.code"
        label="Scripts"
        type="textarea"
        @keydown="onKeyDown"
      />
      <pre>
        <code class="language-javascript">{{ script.code }}</code>
      </pre>
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
import hljs from 'highlight.js'
import { computed, ref, watch } from 'vue'

export interface ScriptSnippet {
  name: string
  code: string
}

const props = defineProps<{
  scriptSnippets: ScriptSnippet[]
  submitString?: string
}>()

const emit = defineEmits<{
  (e: 'save', script: ScriptSnippet): Promise<void>
  (e: 'execute', script: ScriptSnippet, args: unknown): void
}>()

const options = computed(() =>
  props.scriptSnippets.map((snippet, i) => ({
    label: snippet.name,
    value: i,
  }))
)
const selected = ref(0)
const script = ref<ScriptSnippet>({
  name: '',
  code: '',
})
const args = ref('')

watch(
  () => selected.value,
  (v) => {
    script.value = props.scriptSnippets[v]
  }
)

const onKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault()
    save()
  }
}

watch(
  () => script.value.code,
  () => {
    hljs.highlightAll()
  }
)

const isSaving = ref(false)

const save = async () => {
  if (isSaving.value) return
  try {
    isSaving.value = true
    console.log(script.value)
    if (script.value === undefined) return
    await emit('save', script.value)
  } finally {
    isSaving.value = false
  }
}

const exec = () => {
  console.log(script.value)
  if (script.value === undefined) return
  const t = args.value.trim()
  emit('execute', script.value, t === '' ? undefined : JSON.parse(args.value))
}
</script>
