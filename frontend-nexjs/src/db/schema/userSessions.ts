import { pgTable, uuid, text, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userSessions = pgTable('user_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  deviceId: text('device_id').notNull(),
  status: varchar('status', { length: 12 }).notNull().default('active'),
  userAgentRaw: text('user_agent_raw'),
  browserName: varchar('browser_name', { length: 64 }),
  browserVersion: varchar('browser_version', { length: 64 }),
  osName: varchar('os_name', { length: 64 }),
  osVersion: varchar('os_version', { length: 64 }),
  deviceType: varchar('device_type', { length: 32 }),
  isBot: boolean('is_bot'),
  ipAddress: varchar('ip_address', { length: 64 }),
  revokedReason: text('revoked_reason'),
  lastSeen: timestamp('last_seen', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  userIdx: index('idx_user_sessions_user').on(t.userId),
  deviceIdx: index('idx_user_sessions_device').on(t.deviceId),
}));

export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;
