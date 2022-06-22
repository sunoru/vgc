"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // scripts/consts.ts
  var consts_exports = {};
  __export(consts_exports, {
    RestrictedPokemons: () => RestrictedPokemons
  });
  var RestrictedPokemons = [
    "Mewtwo",
    "Lugia",
    "Ho-Oh",
    "Kyogre",
    "Groudon",
    "Rayquaza",
    "Dialga",
    "Palkia",
    "Giratina",
    "Reshiram",
    "Zekrom",
    "Kyurem",
    "Kyurem-Black",
    "Kyurem-White",
    "Xerneas",
    "Yveltal",
    "Zygarde",
    "Cosmog",
    "Cosmoem",
    "Solgaleo",
    "Lunala",
    "Necrozma",
    "Necrozma-Dawn-Wings",
    "Necrozma-Dusk-Mane",
    "Zacian-*",
    "Zamazenta-*",
    "Eternatus",
    "Calyrex",
    "Calyrex-Shadow",
    "Calyrex-Ice"
  ];

  // scripts/default-scripts.ts
  var default_scripts_exports = {};
  __export(default_scripts_exports, {
    myBattles: () => myBattles,
    myTeam: () => myTeam,
    opponentTeam: () => opponentTeam,
    restrictedSentOut: () => restrictedSentOut,
    teamSentOut: () => teamSentOut
  });

  // scripts/helpers.ts
  var helpers_exports = {};
  __export(helpers_exports, {
    categorize: () => categorize,
    compareName: () => compareName,
    getOpponent: () => getOpponent,
    getPlayer: () => getPlayer,
    getRestrictedPokes: () => getRestrictedPokes,
    hasPokes: () => hasPokes,
    makePokemonSet: () => makePokemonSet,
    normalizeName: () => normalizeName,
    sentOutPokes: () => sentOutPokes
  });
  var normalizeName = (name) => {
    if (!name.includes("-"))
      return name;
    if (["Necrozma-", "Calyrex-", "Kyurem-", "Ho-Oh"].some((x) => name.startsWith(x)))
      return name;
    if (["-F", "-Therian"].some((x) => name.endsWith(x)))
      return name;
    if (name.endsWith("-Gmax"))
      name = name.slice(0, -5);
    const tmp = name.split("-", 2);
    return tmp.length === 1 ? name : `${tmp[0]}-*`;
  };
  var compareName = (a, b) => normalizeName(a) === normalizeName(b);
  var makePokemonSet = (pokes) => Immutable.Set(Array.isArray(pokes) ? pokes.map(normalizeName) : pokes);
  var getPlayer = (battle, nameOrIsPlayer2) => {
    const isPlayer2 = typeof nameOrIsPlayer2 === "boolean" ? nameOrIsPlayer2 : typeof nameOrIsPlayer2 === "string" ? nameOrIsPlayer2 === battle.p2 : nameOrIsPlayer2 === 2 /* Player2 */;
    return {
      name: isPlayer2 ? battle.p2 : battle.p1,
      team: Immutable.Set((isPlayer2 ? battle.team2 : battle.team1).map(normalizeName)),
      sentOut: isPlayer2 ? battle.team2SentOut : battle.team1SentOut
    };
  };
  var getOpponent = (battle) => battle.userPlayer === 0 /* None */ ? { name: "", team: Immutable.Set([]), sentOut: [] } : getPlayer(battle, battle.userPlayer === 1 /* Player1 */);
  var hasPokes = (player, pokes) => player.team.isSuperset(makePokemonSet(pokes));
  var sentOutPokes = (player, pokes) => makePokemonSet(player.sentOut.map((x) => x.id)).isSuperset(makePokemonSet(pokes));
  var getRestrictedPokes = (player) => {
    return player.team.filter((x) => RestrictedPokemons.includes(x));
  };
  var categorize = (items, getKey) => {
    let data = Immutable.Map();
    for (const item of items) {
      const key = getKey(item);
      const list = data.get(key) || [];
      list.push(item);
      if (!data.has(key)) {
        data = data.set(key, list);
      }
    }
    return data;
  };

  // scripts/default-scripts.ts
  var myBattles = (battle) => battle.userPlayer !== 0 /* None */;
  var myTeam = (battle, pokes) => hasPokes(getPlayer(battle, battle.userPlayer), pokes);
  var opponentTeam = (battle, pokes) => hasPokes(getOpponent(battle), pokes);
  var teamSentOut = (battles, onlyLeads = true, getTeam = (p) => p.team) => {
    const data = categorize(battles, (battle) => getTeam(getOpponent(battle)));
    return [...data].map(([team, bs]) => {
      const data2 = categorize(bs, (b) => Immutable.Set(getOpponent(b).sentOut.slice(0, onlyLeads ? 2 : 4).map((x) => x.id)));
      return {
        key: team.toArray(),
        win: bs.filter((b) => b.winner === b.userPlayer).length,
        total: bs.length,
        sentOuts: [...data2].map(([sentOut, bs2]) => ({
          sentOut,
          win: bs2.filter((b) => b.winner === b.userPlayer).length,
          total: bs2.length
        })).sort((a, b) => b.total - a.total)
      };
    }).sort((a, b) => b.total - a.total);
  };
  var restrictedSentOut = (battles, onlyLeads = true) => teamSentOut(battles, onlyLeads, getRestrictedPokes);

  // scripts/index.ts
  window.vgcScripts = {
    consts: consts_exports,
    defaultScripts: default_scripts_exports,
    helpers: helpers_exports
  };
  var w = window;
  Object.entries(helpers_exports).forEach(([key, value]) => void (w[key] = value));
  Object.entries(default_scripts_exports).forEach(([key, value]) => void (w[key] = value));
})();
