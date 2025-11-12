ALTER TABLE "user_sessions" ADD COLUMN "auth0_sid" text;--> statement-breakpoint
CREATE INDEX "idx_user_sessions_auth0_sid" ON "user_sessions" USING btree ("auth0_sid");