import { pgTable, uuid, text, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  auth0Id: text('auth0_id').notNull().unique(),
  displayName: text('display_name'),
  email: varchar('email', { length: 320 }),
  emailVerified: boolean('email_verified').notNull().default(false),
  pictureUrl: text('picture_url'),
  phone: varchar('phone', { length: 32 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  auth0Idx: index('idx_users_auth0').on(t.auth0Id),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
