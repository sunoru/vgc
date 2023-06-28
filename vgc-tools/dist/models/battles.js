import { Player } from './player.js';
export var PlayerNumber;
(function (PlayerNumber) {
    PlayerNumber[PlayerNumber["Unknown"] = 0] = "Unknown";
    PlayerNumber[PlayerNumber["Player1"] = 1] = "Player1";
    PlayerNumber[PlayerNumber["Player2"] = 2] = "Player2";
})(PlayerNumber || (PlayerNumber = {}));
export class ParsedBattle {
    time = 0;
    platform = 'Showdown';
    // replay.id for PS replays and UUID for other platforms
    id = '';
    url;
    p1 = '';
    p2 = '';
    format = '';
    rating1 = 0;
    rating2 = 0;
    rating;
    numTurns;
    timeParsed = 0;
    winner = PlayerNumber.Unknown;
    team1 = [];
    team2 = [];
    team1SentOut = [];
    team2SentOut = [];
    remarks = '';
    tags = [];
    userPlayer = PlayerNumber.Unknown;
    log;
    constructor(battle = {}) {
        Object.assign(this, battle);
    }
    getPlayer(player = PlayerNumber.Unknown) {
        if (player === PlayerNumber.Unknown) {
            if (this.userPlayer === PlayerNumber.Unknown) {
                // default to player 1
                return this.getPlayer(PlayerNumber.Player1);
            }
            return this.getPlayer(this.userPlayer);
        }
        const isP1 = player === PlayerNumber.Player1;
        const name = isP1 ? this.p1 : this.p2;
        const team = isP1 ? this.team1 : this.team2;
        const sentOut = isP1 ? this.team1SentOut : this.team2SentOut;
        const rating = isP1 ? this.rating1 : this.rating2;
        return new Player(name, team, sentOut, rating);
    }
    getOpponent() {
        // default to player 2 if userPlayer is unknown
        return this.getPlayer(this.userPlayer === PlayerNumber.Player2 ? PlayerNumber.Player1 : PlayerNumber.Player2);
    }
}
//# sourceMappingURL=battles.js.map