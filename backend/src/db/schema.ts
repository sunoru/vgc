import { relations } from 'drizzle-orm'
import {
  bigint,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  name: varchar('name', { length: 64 }).notNull(),
  discordId: bigint('discord_id', { mode: 'bigint' }).unique().notNull(),
  discordUsername: varchar('username', { length: 64 }).unique().notNull(),
})

export const userRelations = relations(user, ({ many }) => ({
  players: many(player),
  playerToUser: many(playerToUser),
}))

export const player = pgTable('player', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  name: varchar('name', { length: 64 }),
  // showdown specific
  // Only support the official server for now
  username: varchar('username', { length: 64 }).unique(),
  password: text('password'),
  ownerId: integer('owner_id').references(() => user.id),
})

export const playerRelations = relations(player, ({ one, many }) => ({
  owner: one(user, {
    fields: [player.ownerId],
    references: [user.id],
  }),
  playerToUser: many(playerToUser),
  playerToTeam: many(playerToTeam),
  replays: many(replay),
}))

export const playerToUser = pgTable(
  'player_to_user',
  {
    playerId: integer('player_id').references(() => player.id),
    userId: integer('user_id').references(() => user.id),
  },
  (table) => ({ pk: primaryKey({ columns: [table.playerId, table.userId] }) }),
)

export const playerToUserRelations = relations(playerToUser, ({ one }) => ({
  player: one(player, {
    fields: [playerToUser.playerId],
    references: [player.id],
  }),
  user: one(user, {
    fields: [playerToUser.userId],
    references: [user.id],
  }),
}))

// No validation is done so `Urshifu-*` and `Urshifu-Rapid-Strike` are both different entries.
export const poke = pgTable('poke', {
  id: serial('id').primaryKey(),
  dexId: varchar('dex_id', { length: 64 }),
  name: varchar('name', { length: 64 }).notNull().unique(),
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

export const teamRelations = relations(team, ({ many }) => ({
  playerToTeam: many(playerToTeam),
  replays: many(replay),
}))

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

export const playerToTeamRelations = relations(playerToTeam, ({ one }) => ({
  player: one(player, {
    fields: [playerToTeam.playerId],
    references: [player.id],
  }),
  team: one(team, {
    fields: [playerToTeam.teamId],
    references: [team.id],
  }),
}))

export const battlePlayerEnum = pgEnum('battle_player', ['Unknown', 'Player1', 'Player2'])

export const format = pgTable('format', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 64 }).unique(),
  name: varchar('name', { length: 64 }),
})

// Only showdown replay.
export const replay = pgTable(
  'replay',
  {
    pk: serial('pk').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    id: varchar('id', { length: 64 }).unique().notNull(),
    time: timestamp('time').notNull().defaultNow(),
    url: text('url'),
    player1Id: integer('player1_id')
      .references(() => player.id)
      .notNull(),
    player2Id: integer('player2_id')
      .references(() => player.id)
      .notNull(),
    team1Id: integer('team1_id')
      .references(() => team.id)
      .notNull(),
    team2Id: integer('team2_id')
      .references(() => team.id)
      .notNull(),
    formatId: integer('format_id')
      .references(() => format.id)
      .notNull(),
    rating1: integer('rating1').notNull(),
    rating2: integer('rating2').notNull(),
    rating: integer('rating').notNull(),
    numTurns: integer('num_turns').notNull(),
    winner: battlePlayerEnum('winner').notNull(),
    // Store poke IDs separately for easier querying
    team1SentOutPokes: integer('team1_sent_out_pokes')
      .references(() => poke.id)
      .array(6)
      .notNull(),
    team1SentOut: jsonb('team1_sent_out').notNull(),
    team2SentOutPokes: integer('team2_sent_out_pokes')
      .references(() => poke.id)
      .array(6)
      .notNull(),
    team2SentOut: jsonb('team2_sent_out').notNull(),
    remarks: text('remarks').notNull().default(''),
    tags: text('tags').array().notNull().default([]),
    log: text('log').notNull(),
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
    team1SentOutPokesIdx: index('team1_sent_out_pokes_idx').on(table.team1SentOutPokes),
    team2SentOutPokesIdx: index('team2_sent_out_pokes_idx').on(table.team2SentOutPokes),
    tagsIdx: index('tags_idx').on(table.tags),
  }),
)

export const replayRelations = relations(replay, ({ one }) => ({
  player1: one(player, {
    fields: [replay.player1Id],
    references: [player.id],
  }),
  player2: one(player, {
    fields: [replay.player2Id],
    references: [player.id],
  }),
  team1: one(team, {
    fields: [replay.team1Id],
    references: [team.id],
  }),
  team2: one(team, {
    fields: [replay.team2Id],
    references: [team.id],
  }),
}))
