import type { ID } from '@pkmn/sim'

// Though every mod is included, I only care about gen9vgc right now.
export type BattleTeambuilderMod =
  | 'gen1'
  | 'gen1nfe'
  | 'gen1stadium'
  | 'gen2'
  | 'gen2nfe'
  | 'gen2stadium2'
  | 'gen3'
  | 'gen3nfe'
  | 'gen3doubles'
  | 'gen4'
  | 'gen4nfe'
  | 'gen4doubles'
  | 'gen4vgc'
  | 'gen5'
  | 'gen5nfe'
  | 'gen5doubles'
  | 'gen5vgc'
  | 'gen6'
  | 'gen6nfe'
  | 'gen6doubles'
  | 'gen6vgc'
  | 'gen7'
  | 'gen7nfe'
  | 'gen7doubles'
  | 'gen7vgc'
  | 'gen7letsgo'
  | 'gen8'
  | 'gen8nfe'
  | 'gen8doubles'
  | 'gen8vgc'
  | 'gen8dlc1'
  | 'gen8bdsp'
  | 'gen8metronome'
  | 'gen8natdex'
  | 'gen8dlc1doubles'
  | 'gen8bdspdoubles'
  | 'gen9nfe'
  | 'gen9doubles'
  | 'gen9vgc'
  | 'gen9metronome'
  | 'gen9natdex'

// 'learnsets'
// 'tiers',        'items',           'overrideTier',
// 'zuBans',       'monotypeBans',    'formatSlices',
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type IsVGC<T extends string> = T extends `${infer P}vgc${infer S}` ? true : false
export type VGCSliceKeys = 'Restricted Legendary' | 'Regular' | 'NFE' | 'LC'
export type BattleTeambuilderModData<T extends string> = {
  formatSlices: IsVGC<T> extends true
    ? {
        [K in VGCSliceKeys]: number
      }
    : Record<string, number>
  tiers: (ID | ['header', keyof BattleTeambuilderModData<T>['formatSlices']])[]
} & Record<string, unknown>
export type VGCBattleTeambuilderData = BattleTeambuilderModData<'vgc'>
export declare const BattleTeambuilderTable: {
  [mod in BattleTeambuilderMod]: BattleTeambuilderModData<mod>
} & Record<string, unknown>
