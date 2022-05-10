import { ParsedBattle, ParsedBattles } from './models'

export const getLocalBattles = (): ParsedBattles =>
  JSON.parse(localStorage.getItem('battles') || '{}')

export const saveBattle = (battle: ParsedBattle) => {
  const battles = getLocalBattles()
  battles[battle.id] = battle
  localStorage.setItem('battles', JSON.stringify(battles))
}
