import { db } from '@/db';
import { userSessions, type UserSession, type NewUserSession } from '@/db/schema/userSessions';
import { eq, and } from 'drizzle-orm';
import type { DeviceInfo } from './userAgent';

export async function createOrUpdateSession(
  userId: string,
  deviceId: string,
  deviceInfo: DeviceInfo
): Promise<UserSession> {
  // Check if session exists for this user and device
  const existingSession = await db.query.userSessions.findFirst({
    where: and(
      eq(userSessions.userId, userId),
      eq(userSessions.deviceId, deviceId),
      eq(userSessions.status, 'active')
    ),
  });

  if (existingSession) {
    // Update existing session
    const [updated] = await db
      .update(userSessions)
      .set({
        userAgentRaw: deviceInfo.raw,
        browserName: deviceInfo.browser,
        browserVersion: deviceInfo.browserVersion,
        osName: deviceInfo.os,
        osVersion: deviceInfo.osVersion,
        deviceType: deviceInfo.device,
        isBot: deviceInfo.isBot,
        ipAddress: deviceInfo.ip,
        lastSeen: new Date(),
      })
      .where(eq(userSessions.id, existingSession.id))
      .returning();
    
    return updated;
  }

  // Create new session
  const sessionData: NewUserSession = {
    userId,
    deviceId,
    status: 'active',
    userAgentRaw: deviceInfo.raw,
    browserName: deviceInfo.browser,
    browserVersion: deviceInfo.browserVersion,
    osName: deviceInfo.os,
    osVersion: deviceInfo.osVersion,
    deviceType: deviceInfo.device,
    isBot: deviceInfo.isBot,
    ipAddress: deviceInfo.ip,
  };

  const [newSession] = await db
    .insert(userSessions)
    .values(sessionData)
    .returning();

  return newSession;
}

export async function getActiveSessions(userId: string): Promise<UserSession[]> {
  return db.query.userSessions.findMany({
    where: and(
      eq(userSessions.userId, userId),
      eq(userSessions.status, 'active')
    ),
    orderBy: (sessions, { desc }) => [desc(sessions.lastSeen)],
  });
}

export async function getAllSessions(userId: string): Promise<UserSession[]> {
  return db.query.userSessions.findMany({
    where: eq(userSessions.userId, userId),
    orderBy: (sessions, { desc }) => [desc(sessions.lastSeen)],
  });
}

export async function revokeSession(sessionId: string, reason: string): Promise<void> {
  await db
    .update(userSessions)
    .set({
      status: 'revoked',
      revokedReason: reason,
    })
    .where(eq(userSessions.id, sessionId));
}
