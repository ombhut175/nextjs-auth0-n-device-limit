import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { userSessions } from '@/db/schema/userSessions';
import { eq, and } from 'drizzle-orm';
import { getMgmtToken } from '@/lib/auth0-management';
import { requireAuth } from '@/lib/adminAuth';
import {
  responseBadRequest,
  responseNotFound,
  responseInternalServerError,
  responseSuccessfulWithData,
} from '@/helpers/responseHelpers';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { error: authError } = await requireAuth();
  if (authError) {
    return authError;
  }

  try {
    const { userId } = await params;

    if (!userId) {
      return responseBadRequest('userId is required');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return responseBadRequest('Invalid userId format');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return responseNotFound('User not found');
    }

    const token = await getMgmtToken();
    const revokeResponse = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(user.auth0Id)}/sessions`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const success = revokeResponse.status === 202 || revokeResponse.status === 204 || revokeResponse.status === 404;

    if (!success) {
      const errorText = await revokeResponse.text();
      console.error('Auth0 session revocation failed:', revokeResponse.status, errorText);
      return responseInternalServerError(`Auth0 API returned ${revokeResponse.status}`);
    }

    const result = await db
      .update(userSessions)
      .set({
        status: 'revoked',
        revokedReason: 'admin_revoked_all',
        lastSeen: new Date(),
      })
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.status, 'active')
        )
      )
      .returning();

    return responseSuccessfulWithData({
      message: revokeResponse.status === 404
        ? `No active Auth0 sessions found, revoked ${result.length} local session(s)`
        : `Successfully revoked ${result.length} session(s)`,
      data: {
        ok: true,
        status: revokeResponse.status,
        revokedCount: result.length,
      },
    });
  } catch (error) {
    return responseInternalServerError('Failed to revoke sessions');
  }
}
