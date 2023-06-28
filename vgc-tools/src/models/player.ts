import { ParsedPokemon } from './battles'

export class Player {
  constructor(
    public name: string,
    public team: string[],
    public sentOut: ParsedPokemon[] = [],
    public rating = 0
  ) {}
}
