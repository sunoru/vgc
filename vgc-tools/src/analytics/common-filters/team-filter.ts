import { ParsedBattle } from '../../models'

import { Filter } from '../types'

export class FormatFilter extends Filter<[string[]]> {
  getArgs(battles: ParsedBattle[]) {
    const choices = new Set<string>()
    for (const battle of battles) {
      const { formatid } = battle
      if (formatid) {
        choices.add(formatid)
      }
    }
    return [
      [
        {
          type: 'choice' as const,
          choices: Array.from(choices),
        } as const,
      ] as const,
    ]
  }

  apply(battle: ParsedBattle, formats: string[]) {
    return formats.includes(battle.formatid)
  }
}
