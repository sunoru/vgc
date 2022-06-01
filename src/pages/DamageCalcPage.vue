<template>
  <page-base class="row items-top justify-evenly" title="Damage Calculator">
    <div class="col">
      <!-- <div v-if="!loaded" class="row q-mt-md justify-center">
      </div> -->
      <div class="row justify-center" :style="{ height }">
        <q-spinner v-if="!loaded" class="q-mt-md" color="primary" size="3em" />
        <iframe
          class="col iframe"
          :class="{ hidden: !loaded }"
          ref="iframeRef"
          src="/deps/damagecalc/index.html"
          frameborder="0"
        />
      </div>
      <div v-if="loaded" class="row justify-center">
        <q-item :href="OriginalURL" target="_blank">
          Source by nerd-of-now.
        </q-item>
      </div>
    </div>
  </page-base>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'

import PageBase from '../layouts/PageBase.vue'
import { LocalConfigs } from '../utils/config'
import { asyncCall } from '../utils/utils'
import { DamageCalc } from '../utils/damage-calc'

const OriginalURL = 'https://github.com/nerd-of-now/NCP-VGC-Damage-Calculator'

const iframeRef = ref<HTMLIFrameElement>()
const $q = useQuasar()
const loaded = ref(false)
const height = ref('auto')
const damageCalc = ref<DamageCalc>()

const updateTheme = (dark: boolean) => {
  const iframe = iframeRef.value
  if (!iframe || !iframe.contentDocument) return
  const themeButton =
    iframe.contentDocument.querySelector<HTMLButtonElement>('#switchTheme')
  if (!themeButton) return
  themeButton.style.visibility = 'hidden'
  if (dark === (themeButton.value === 'dark')) {
    themeButton.click()
  }
}

watch(() => $q.dark.isActive, updateTheme)
onMounted(() => {
  const iframe = iframeRef.value
  if (!iframe) return
  iframe.onload = () => {
    updateTheme(LocalConfigs.useDarkMode)
    const body = iframe.contentDocument?.body
    if (body) {
      body.style.boxSizing = 'border-box'
      body.style.height = '100%'
      if (body.parentElement) {
        body.parentElement.style.boxSizing = 'border-box'
        body.parentElement.style.height = '100%'
      }
      const header = body.querySelector<HTMLDivElement>('.header')
      if (header) {
        header.style.display = 'none'
      }
      const wrapper = body.querySelector<HTMLDivElement>('body>.wrapper')
      if (wrapper) {
        wrapper.style.paddingTop = '20px'
      }
    }
    if (iframe.contentWindow) {
      damageCalc.value = iframe.contentWindow as DamageCalc
    }
    loaded.value = true
    asyncCall(
      () => void (height.value = body ? body.scrollHeight + 10 + 'px' : 'auto')
    )
  }
})
</script>

<style scoped>
.iframe {
  border: none;
}
</style>
