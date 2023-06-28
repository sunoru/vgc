import { ParsedBattle, PlayerNumber } from './models/index.js';
export interface ImportReplayOptions {
    remarks?: string;
    tags?: string[];
    whichIsUserPlayer?: (p1: string, p2: string) => Promise<PlayerNumber>;
}
export declare const parseBattleLog: (log: string, options?: ImportReplayOptions) => Promise<ParsedBattle>;
export declare const importReplay: (idOrURL: string, options?: ImportReplayOptions & {
    password?: string;
}) => Promise<ParsedBattle>;
