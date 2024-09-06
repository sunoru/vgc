import {
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  time,
  varchar,
} from 'drizzle-orm/pg-core'

export const player = pgTable('player', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 64 }),
})

export const poke = pgTable('poke', {
  id: serial('id').primaryKey(),
  dex: integer('dex'),
  name: varchar('name', { length: 64 }),
})

export const team = pgTable(
  'team',
  {
    id: serial('id').primaryKey(),
    pokes: integer('pokes')
      .references(() => poke.id)
      .array(6),
  },
  (table) => ({
    pokesIdx: index().on(table.pokes),
  }),
)

export const playerToTeam = pgTable(
  'player_to_team',
  {
    playerId: integer('player_id').references(() => player.id),
    teamId: integer('team_id').references(() => team.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.playerId, table.teamId] }),
  }),
)

export const platformEnum = pgEnum('platform', ['Showdown', 'Console'])
export const battlePlayerEnum = pgEnum('battle_player', ['Unknown', 'Player1', 'Player2'])

export const format = pgTable('format', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 64 }).unique(),
  name: varchar('name', { length: 64 }),
})

export const replay = pgTable(
  'replay',
  {
    kid: serial('kid').primaryKey(),
    id: varchar('id', { length: 64 }).unique(),
    time: time('time').defaultNow(),
    platform: platformEnum('platform'),
    url: text('url'),
    player1Id: integer('player1_id').references(() => player.id),
    player2Id: integer('player2_id').references(() => player.id),
    team1Id: integer('team1_id').references(() => team.id),
    team2Id: integer('team2_id').references(() => team.id),
    formatId: integer('format_id').references(() => format.id),
    rating1: integer('rating1'),
    rating2: integer('rating2'),
    rating: integer('rating'),
    numTurns: integer('num_turns'),
    timeParsed: time('time_parsed'),
    winner: battlePlayerEnum('winner'),
  },
  (table) => ({
    playerTeam1: foreignKey({
      columns: [table.player1Id, table.team1Id],
      foreignColumns: [playerToTeam.playerId, playerToTeam.teamId],
      name: 'replay_player_team1',
    }),
    playerTeam2: foreignKey({
      columns: [table.player2Id, table.team2Id],
      foreignColumns: [playerToTeam.playerId, playerToTeam.teamId],
      name: 'replay_player_team2',
    }),
    player1Idx: index('player1_idx').on(table.player1Id),
    player2Idx: index('player2_idx').on(table.player2Id),
    team1Idx: index('team1_idx').on(table.team1Id),
    team2Idx: index('team2_idx').on(table.team2Id),
  }),
)
