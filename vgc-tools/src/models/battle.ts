import { TypeName } from '@pkmn/types'

import { Player } from './player.js'

export type Platform = 'Showdown' | 'Console'

export enum PlayerNumber {
  Unknown = 0,
  Player1 = 1,
  Player2 = 2,
}

export interface ParsedPokemon {
  id: string
  ability?: string
  item?: string
  moves: string[]
  sentOutOrder: number
  teraType?: TypeName

  [otherKey: string]: unknown
}

export class ParsedBattle {
  public time = 0
  public platform: Platform = 'Showdown'
  // replay.id for PS replays and UUID for other platforms
  public id = ''
  public url?: string
  public p1 = ''
  public p2 = ''
  public format = ''

  _formatid = ''
  public get formatid(): string {
    if (this._formatid) {
      return this._formatid
    }
    if (this.platform === 'Showdown') {
      return this.id.split('-')[0]
    }
    return ''
  }
  public set formatid(formatid: string) {
    this._formatid = formatid
  }

  public rating1 = 0
  public rating2 = 0
  public rating?: number
  public numTurns?: number

  public timeParsed = 0
  public winner = PlayerNumber.Unknown
  public team1: string[] = []
  public team2: string[] = []
  public team1SentOut: ParsedPokemon[] = []
  public team2SentOut: ParsedPokemon[] = []

  public remarks = ''
  public tags: string[] = []

  public userPlayer = PlayerNumber.Unknown

  public log?: string

  public constructor(battle: Partial<ParsedBattle> = {}) {
    Object.assign(this, battle)
  }

  public getPlayer(player = PlayerNumber.Unknown): Player {
    if (player === PlayerNumber.Unknown) {
      if (this.userPlayer === PlayerNumber.Unknown) {
        // default to player 1
        return this.getPlayer(PlayerNumber.Player1)
      }
      return this.getPlayer(this.userPlayer)
    }
    const isP1 = player === PlayerNumber.Player1
    const name = isP1 ? this.p1 : this.p2
    const team = isP1 ? this.team1 : this.team2
    const sentOut = isP1 ? this.team1SentOut : this.team2SentOut
    const rating = isP1 ? this.rating1 : this.rating2
    return new Player(name, team, sentOut, rating)
  }

  public getOpponent(): Player {
    // default to player 2 if userPlayer is unknown
    return this.getPlayer(
      this.userPlayer === PlayerNumber.Player2 ? PlayerNumber.Player1 : PlayerNumber.Player2,
    )
  }
}
