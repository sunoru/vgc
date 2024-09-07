import { Generations } from '@pkmn/data'
import { Dex } from '@pkmn/sim'
import * as DexTypes from '@pkmn/dex-types'

export const CurrentGeneration = new Generations(Dex as unknown as DexTypes.Dex).get(9)

export const CurrentFormatID = 'gen9vgc2024regg' as const
export const VGCFormat = Dex.formats.get(CurrentFormatID)
export const VGCDex = Dex.forFormat(CurrentFormatID)
export const VGCRuleTable = Dex.formats.getRuleTable(VGCFormat)
