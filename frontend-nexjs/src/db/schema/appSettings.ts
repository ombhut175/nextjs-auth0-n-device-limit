import { pgTable, uuid, integer, timestamp } from 'drizzle-orm/pg-core';

export const appSettings = pgTable('app_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  maxDevices: integer('max_devices').notNull().default(3),
  inactivityDays: integer('inactivity_days').notNull().default(7),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AppSettings = typeof appSettings.$inferSelect;
export type NewAppSettings = typeof appSettings.$inferInsert;
