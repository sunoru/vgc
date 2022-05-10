export interface Pokemon {
  id: string
  ability?: string
  item?: string
  moves: string[]
  [otherKey: string]: unknown
}

export interface ParsedBattle {
  time: number
  id: string
  password: string
  p1: string
  p2: string
  format: string

  timeParsed: number
  isWinnerP1: boolean
  team1: string[]
  team2: string[]
  team1SentOut: Pokemon[]
  team2SentOut: Pokemon[]

  remarks: string
}

export type ParsedBattles = {
  [id: string]: ParsedBattle
}
