// A workaround since importing @pkmn/sim as esm would throw an error in dev mode.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// export const Sim = (await import('@pkmn/sim/build/cjs/sim/index.js')) as typeof import('@pkmn/sim')
import * as Sim from '@pkmn/sim'
export const { Dex } = Sim

export const Formats = Array.from(Dex.formats.rulesetCache.keys())

// https://github.com/smogon/pokemon-showdown/blob/master/config/formats.ts
// const VGC2023Format = new Format({
//   name: '[Gen 9] VGC 2023 Series 1',
//   mod: 'gen9',
//   gameType: 'doubles',
//   ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Paldea Pokedex', 'Min Source Gen = 9', 'VGC Timer'],
//   banlist: ['Sub-Legendary'],
// })
// export const DefaultFormat = 'gen9vgc2023'
