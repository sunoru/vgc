<template>
  <page-base class="row items-top justify-evenly" title="Damage Calculator">
    <div class="col">
      <div class="row" :style="{ height }">
        <iframe
          class="col iframe"
          :class="{ invisible: !loaded }"
          ref="iframeRef"
          src="/deps/damagecalc/index.html"
          frameborder="0"
        />
      </div>
      <div class="row justify-evenly">
        <q-item :href="OriginalURL" target="_blank">
          Source by nerd-of-now.
        </q-item>
      </div>
    </div>
  </page-base>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import PageBase from 'src/layouts/PageBase.vue'
import { useQuasar } from 'quasar'
import { LocalConfigs } from 'src/utils/config'

const OriginalURL = 'https://github.com/nerd-of-now/NCP-VGC-Damage-Calculator'

const iframeRef = ref<HTMLIFrameElement>()
const $q = useQuasar()
const loaded = ref(false)
const height = ref('auto')

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
      if (body.parentElement) {
        body.parentElement.style.height = '100%'
      }
      const header = body.querySelector<HTMLDivElement>('.header')
      if (header) {
        header.style.display = 'none'
      }
      body.style.paddingTop = '20px'
    }
    height.value = body ? body.scrollHeight + 'px' : 'auto'
    loaded.value = true
  }
})
</script>

<style scoped>
.iframe {
  border: none;
}
</style>
