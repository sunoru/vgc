DO $$ BEGIN
 CREATE TYPE "public"."battle_player" AS ENUM('Unknown', 'Player1', 'Player2');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."platform" AS ENUM('Showdown', 'Console');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "format" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(64),
	"name" varchar(64),
	CONSTRAINT "format_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_to_team" (
	"player_id" integer,
	"team_id" integer,
	CONSTRAINT "player_to_team_player_id_team_id_pk" PRIMARY KEY("player_id","team_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "poke" (
	"id" serial PRIMARY KEY NOT NULL,
	"dex" integer,
	"name" varchar(64)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "replay" (
	"kid" serial PRIMARY KEY NOT NULL,
	"id" varchar(64),
	"time" time DEFAULT now(),
	"platform" "platform",
	"url" text,
	"player1_id" integer,
	"player2_id" integer,
	"team1_id" integer,
	"team2_id" integer,
	"format_id" integer,
	"rating1" integer,
	"rating2" integer,
	"rating" integer,
	"num_turns" integer,
	"time_parsed" time,
	"winner" "battle_player",
	CONSTRAINT "replay_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"pokes" integer[6]
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_to_team" ADD CONSTRAINT "player_to_team_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_to_team" ADD CONSTRAINT "player_to_team_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replay" ADD CONSTRAINT "replay_player1_id_player_id_fk" FOREIGN KEY ("player1_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replay" ADD CONSTRAINT "replay_player2_id_player_id_fk" FOREIGN KEY ("player2_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replay" ADD CONSTRAINT "replay_team1_id_team_id_fk" FOREIGN KEY ("team1_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replay" ADD CONSTRAINT "replay_team2_id_team_id_fk" FOREIGN KEY ("team2_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replay" ADD CONSTRAINT "replay_format_id_format_id_fk" FOREIGN KEY ("format_id") REFERENCES "public"."format"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replay" ADD CONSTRAINT "replay_player_team1" FOREIGN KEY ("player1_id","team1_id") REFERENCES "public"."player_to_team"("player_id","team_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replay" ADD CONSTRAINT "replay_player_team2" FOREIGN KEY ("player2_id","team2_id") REFERENCES "public"."player_to_team"("player_id","team_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "player1_idx" ON "replay" USING btree ("player1_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "player2_idx" ON "replay" USING btree ("player2_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team1_idx" ON "replay" USING btree ("team1_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team2_idx" ON "replay" USING btree ("team2_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_pokes_index" ON "team" USING btree ("pokes");