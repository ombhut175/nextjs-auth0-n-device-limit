import { pgTable, uuid, text, varchar, boolean, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';
import { sql } from 'drizzle-orm';

export const userSessions = pgTable('user_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  deviceId: text('device_id').notNull(),
  auth0Sid: text('auth0_sid'),
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
  revokedByDeviceId: text('revoked_by_device_id'),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  lastSeen: timestamp('last_seen', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  index('idx_user_sessions_user').on(t.userId),
  index('idx_user_sessions_device').on(t.deviceId),
  index('idx_user_sessions_auth0_sid').on(t.auth0Sid),
  uniqueIndex('idx_user_sessions_active_device')
    .on(t.userId, t.deviceId)
    .where(sql`status = 'active'`),
]);

export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;
