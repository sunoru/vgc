import { ParsedBattle } from '../models'

export type ArgNumber =
  | typeof Number
  | {
      type: 'number'
      key?: string
      min?: number
      max?: number
    }
export type ArgString =
  | typeof String
  | {
      type: 'string'
      key?: string
    }
export type ArgBoolean =
  | typeof Boolean
  | {
      type: 'boolean'
      key?: string
    }
export type ArgChoice = {
  type: 'choice'
  choices: string[]
  key?: string
}
export type ArgArray =
  | typeof Array
  | readonly [Arg]
  | {
      type: 'array'
      key?: string
      item: Arg
    }
export type Arg = ArgNumber | ArgString | ArgBoolean | ArgChoice | ArgArray

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class AbstractAnalyzer<TArgs extends unknown[] = [], TResult = any> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getArgs(battles: ParsedBattle[]): Arg[] {
    return []
  }

  abstract apply(battle: ParsedBattle, ...args: TArgs): TResult
}

export abstract class Filter<TArgs extends unknown[] = []> extends AbstractAnalyzer<TArgs, boolean> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class Analyzer<TArgs extends unknown[] = [], TResult = any> extends AbstractAnalyzer<
  TArgs,
  TResult
> {}
