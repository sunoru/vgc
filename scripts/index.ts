import * as consts from './consts'
import * as defaultScripts from './default-scripts'
import * as helpers from './helpers'

declare global {
  interface Window {
    vgcScripts: {
      consts: typeof consts
      defaultScripts: typeof defaultScripts
      helpers: typeof helpers
    }
  }
}

window.vgcScripts = {
  consts,
  defaultScripts,
  helpers,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any
// For being eval-ed
Object.entries(helpers).forEach(([key, value]) => void (w[key] = value))
Object.entries(defaultScripts).forEach(([key, value]) => void (w[key] = value))
