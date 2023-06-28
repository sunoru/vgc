import { ParsedPokemon } from './battles';
export declare class Player {
    name: string;
    team: string[];
    sentOut: ParsedPokemon[];
    rating: number;
    constructor(name: string, team: string[], sentOut?: ParsedPokemon[], rating?: number);
}
