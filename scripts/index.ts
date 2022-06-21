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
