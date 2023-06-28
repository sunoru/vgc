import { defineStore } from 'pinia'
import { reactive, watchEffect } from 'vue'
import { useQuasar } from 'quasar'

export interface Config {
  darkMode: boolean
  useLocalStorage: boolean
  showdownUsernames: string[]
}

export const getLocalConfig = (): Partial<Config> => {
  const config = localStorage.getItem('user-config')
  if (config) {
    return JSON.parse(config)
  }
  return {}
}

export const saveLocalConfig = (config: Partial<Config>) => {
  localStorage.setItem('user-config', JSON.stringify(config))
}

export const getCurrentDarkMode = (config: Partial<Config> = {}): boolean => {
  if (config.darkMode !== undefined) {
    return config.darkMode
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useConfigStore = defineStore('config', () => {
  const localConfig = getLocalConfig()
  const $q = useQuasar()
  const config = reactive<Config>({
    darkMode: getCurrentDarkMode(localConfig),
    useLocalStorage: localConfig.useLocalStorage || true,
    showdownUsernames: localConfig.showdownUsernames || [],
  })
  const setDarkMode = (v: boolean) => $q.dark.set(v)
  watchEffect(() => {
    setDarkMode(config.darkMode)
    saveLocalConfig(config)
  })
  setDarkMode(config.darkMode)
  return {
    config,
  }
})
