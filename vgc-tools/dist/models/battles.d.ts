import { TypeName } from '@pkmn/types';
import { Player } from './player.js';
export type Platform = 'Showdown' | 'Console';
export declare enum PlayerNumber {
    Unknown = 0,
    Player1 = 1,
    Player2 = 2
}
export interface ParsedPokemon {
    id: string;
    ability?: string;
    item?: string;
    moves: string[];
    sentOutOrder: number;
    teraType?: TypeName;
    [otherKey: string]: unknown;
}
export declare class ParsedBattle {
    time: number;
    platform: Platform;
    id: string;
    url?: string;
    p1: string;
    p2: string;
    format: string;
    rating1: number;
    rating2: number;
    rating?: number;
    numTurns?: number;
    timeParsed: number;
    winner: PlayerNumber;
    team1: string[];
    team2: string[];
    team1SentOut: ParsedPokemon[];
    team2SentOut: ParsedPokemon[];
    remarks: string;
    tags: string[];
    userPlayer: PlayerNumber;
    log?: string;
    constructor(battle?: Partial<ParsedBattle>);
    getPlayer(player?: PlayerNumber): Player;
    getOpponent(): Player;
}
