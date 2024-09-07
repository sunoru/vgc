DO $$ BEGIN
 CREATE TYPE "public"."battle_player" AS ENUM('Unknown', 'Player1', 'Player2');
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(64),
	"username" varchar(64),
	"password" text,
	"owner_id" integer,
	CONSTRAINT "player_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_to_team" (
	"player_id" integer,
	"team_id" integer,
	CONSTRAINT "player_to_team_player_id_team_id_pk" PRIMARY KEY("player_id","team_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player_to_user" (
	"player_id" integer,
	"user_id" integer,
	CONSTRAINT "player_to_user_player_id_user_id_pk" PRIMARY KEY("player_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "poke" (
	"id" serial PRIMARY KEY NOT NULL,
	"dex_id" varchar(64),
	"name" varchar(64) NOT NULL,
	CONSTRAINT "poke_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "replay" (
	"pk" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"id" varchar(64) NOT NULL,
	"time" timestamp DEFAULT now() NOT NULL,
	"url" text,
	"player1_id" integer NOT NULL,
	"player2_id" integer NOT NULL,
	"team1_id" integer NOT NULL,
	"team2_id" integer NOT NULL,
	"format_id" integer NOT NULL,
	"rating1" integer NOT NULL,
	"rating2" integer NOT NULL,
	"rating" integer NOT NULL,
	"num_turns" integer NOT NULL,
	"winner" "battle_player" NOT NULL,
	"team1_sent_out_pokes" integer[6] NOT NULL,
	"team1_sent_out" jsonb NOT NULL,
	"team2_sent_out_pokes" integer[6] NOT NULL,
	"team2_sent_out" jsonb NOT NULL,
	"remarks" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"log" text NOT NULL,
	CONSTRAINT "replay_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"pokes" integer[6]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(64) NOT NULL,
	"discord_id" bigint NOT NULL,
	"username" varchar(64) NOT NULL,
	CONSTRAINT "user_discord_id_unique" UNIQUE("discord_id"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player" ADD CONSTRAINT "player_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
 ALTER TABLE "player_to_user" ADD CONSTRAINT "player_to_user_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player_to_user" ADD CONSTRAINT "player_to_user_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
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
CREATE INDEX IF NOT EXISTS "team1_sent_out_pokes_idx" ON "replay" USING btree ("team1_sent_out_pokes");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team2_sent_out_pokes_idx" ON "replay" USING btree ("team2_sent_out_pokes");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_idx" ON "replay" USING btree ("tags");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_pokes_index" ON "team" USING btree ("pokes");