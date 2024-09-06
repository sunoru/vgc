import { ParsedBattle } from 'vgc-tools'

export const loadMock = async (): Promise<ParsedBattle> => {
  return new ParsedBattle(await import('../../../build/mock.json'))
}
