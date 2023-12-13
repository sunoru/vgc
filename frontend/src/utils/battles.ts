import { ParsedBattle } from 'vgc-tools'
import { getAllSavedObjects } from './storage'

export const loadBattles = async (): Promise<ParsedBattle[]> => {
  const data = await getAllSavedObjects('battles')
  const battles = Array.from(Object.values(data))
  return battles
}
