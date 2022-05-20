import Immutable from 'immutable'

export interface Pokemon {
  id: string
  ability?: string
  item?: string
  moves: string[]
  sentOutNumber: number

  [otherKey: string]: unknown
}

export type Platform = 'Showdown' | 'Switch'

export enum PlayerNumber {
  None = 0,
  Player1 = 1,
  Player2 = 2,
}

export interface ParsedBattle {
  time: number
  platform: Platform
  id: string // replay.id for PS replays and UUID for other platforms
  url?: string
  p1: string
  p2: string
  format: string
  rating: number

  timeParsed: number
  winner: PlayerNumber
  team1: string[]
  team2: string[]
  team1SentOut: Pokemon[]
  team2SentOut: Pokemon[]

  remarks: string
  tags: string[]

  userPlayer: PlayerNumber

  log?: string
}

export type Team = Immutable.Set<string>

export interface BattlePlayer {
  name: string
  team: Team
  sentOut: Pokemon[]
}

export type ParsedBattles = {
  [id: string]: ParsedBattle
}

export interface Config {
  myUsernames: string[]
}
