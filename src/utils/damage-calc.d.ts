import JQuery from 'jquery'

declare namespace DamageCalc {
  type Type =
    | 'Typeless'
    | 'Normal'
    | 'Fire'
    | 'Water'
    | 'Electric'
    | 'Grass'
    | 'Ice'
    | 'Fighting'
    | 'Poison'
    | 'Ground'
    | 'Flying'
    | 'Psychic'
    | 'Bug'
    | 'Rock'
    | 'Ghost'
    | 'Dragon'
    | 'Dark'
    | 'Steel'
    | 'Fairy'
  type Nature =
    | 'Adamant'
    | 'Bashful'
    | 'Bold'
    | 'Brave'
    | 'Calm'
    | 'Careful'
    | 'Docile'
    | 'Gentle'
    | 'Hardy'
    | 'Hasty'
    | 'Impish'
    | 'Jolly'
    | 'Lax'
    | 'Lonely'
    | 'Mild'
    | 'Modest'
    | 'Naive'
    | 'Naughty'
    | 'Quiet'
    | 'Quirky'
    | 'Rash'
    | 'Relaxed'
    | 'Sassy'
    | 'Serious'
    | 'Timid'
  type MoveCategory = 'Physical' | 'Special' | 'Status'
  interface Stats {
    hp: number
    at: number
    df: number
    sa: number
    sd: number
    sp: number

    sl?: number // Not in use
  }
  type PokemonID = string
  type AbilityID = string
  type MoveID = string
  type ItemID = string
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
  savecalc: (
    set: DamageCalc.Pokemon,
    spreadName: string,
    accessIVs: JQuery
  ) => void
  savecalc1: () => void
  savecalc2: () => void
  exportset: (
    set: DamageCalc.Pokemon,
    spreadName: string,
    accessIVs: JQuery
  ) => void
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
