import { Config } from './models'

const DefaultLocalConfigs = {
  useLocalStorage: true,
  useDarkMode: true,
}

export const LocalConfigs = new Proxy(
  JSON.parse(localStorage.getItem('local-configs') || '{}') as Partial<
    typeof DefaultLocalConfigs
  >,
  {
    set: (target, key, value) => {
      if (!(key in DefaultLocalConfigs)) {
        return false
      }
      target[key as keyof typeof DefaultLocalConfigs] = value
      localStorage.setItem('local-configs', JSON.stringify(target))
      return true
    },
    get: (target, key) => {
      const k = key as keyof typeof DefaultLocalConfigs
      return target[k] || DefaultLocalConfigs[k]
    },
  }
) as typeof DefaultLocalConfigs

let _cachedConfig: Config | null = null

export const getConfig = async (force = false): Promise<Config> => {
  if (force || _cachedConfig === null) {
    if (LocalConfigs.useLocalStorage) {
      const saved = localStorage.getItem('config')
      _cachedConfig =
        saved === null
          ? {
              myUsernames: [],
            }
          : (JSON.parse(saved) as Config)
    } else {
      // TODO
      throw new Error('Not implemented')
    }
  }
  return _cachedConfig
}

export const saveConfig = async (config: Config) => {
  if (LocalConfigs.useLocalStorage) {
    localStorage.setItem('config', JSON.stringify(config))
    _cachedConfig = config
  } else {
    // TODO
    throw new Error('Not implemented')
  }
}
