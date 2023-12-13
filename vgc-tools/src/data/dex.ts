import { Dex } from '@pkmn/sim'

export const CurrentFormatID = 'gen9vgc2023regulatione' as const
export const VGCFormat = Dex.formats.get(CurrentFormatID)
export const VGCDex = Dex.forFormat(CurrentFormatID)
export const VGCRuleTable = Dex.formats.getRuleTable(VGCFormat)
