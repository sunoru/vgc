import type { MoveCategory as TMoveCategory, NatureName, TypeName, As } from 'vgc-tools'

declare namespace DamageCalc {
  type Type = Exclude<TypeName, '???'> | 'Typeless'
  type Nature = NatureName
  type MoveCategory = TMoveCategory
  interface Stats {
    hp: number
    at: number
    df: number
    sa: number
    sd: number
    sp: number

    sl?: number // Not in use
  }
  type PokemonID = string & As<'pokemon-id'>
  type AbilityID = string & As<'ability-id'>
  type MoveID = string & As<'move-id'>
  type ItemID = string & As<'item-id'>
  interface DexPokemon {
    t1: Type
    t2?: Type
    bs: Stats
    w: number
    ab?: AbilityID
    formes?: PokemonID[]
  }
  interface Pokemon {
    ability: AbilityID
    evs: Stats
    item: ItemID
    ivs: Partial<Stats>
    level: number
    moves: MoveID[]
    nature: Nature
  }
  interface Move {
    type: DamageCalc.Type
    category: DamageCalc.MoveCategory
    bp?: number // Base power
    zp?: number // Z-move power
    isSpread?: true
    hasSecondaryEffect?: true
    makesContact?: true
    // Other properties are not used
  }
}

export interface DamageCalc extends Window {
  $: JQueryStatic
  Pokemon: new () => DamageCalc.Pokemon
  deletecustom: () => void
  savecustom: () => void
  savecalc: (set: DamageCalc.Pokemon, spreadName: string, accessIVs: JQuery) => void
  savecalc1: () => void
  savecalc2: () => void
  exportset: (set: DamageCalc.Pokemon, spreadName: string, accessIVs: JQuery) => void
  exportset1: () => void
  exportset2: () => void
  bounds: {
    base: [number, number]
    dvs: [number, number]
    evs: [number, number]
    ivs: [number, number]
    level: [number, number]
    'move-bp': [number, number]
  }
  bounded: keyof DamageCalc['bounds']
  validate: (obj: JQuery, min: number, max: number) => void

  calculate: () => void
  gen: number
  pokedex: { [id: DamageCalc.PokemonID]: DamageCalc.DexPokemon }
  setdex: {
    [pokeID: DamageCalc.PokemonID]: {
      [name: string]: DamageCalc.Pokemon
    }
  }
  moves: {
    [id: DamageCalc.MoveID]: DamageCalc.Move
  }
  abilities: DamageCalc.AbilityID[]
  items: DamageCalc.ItemID[]
  attacker_name: DamageCalc.PokemonID[]
  defender_name: DamageCalc.PokemonID[]
  temp_crit: boolean | undefined
}
