import { NextRequest } from 'next/server';
import { db } from '@/db';
import { userSessions } from '@/db/schema/userSessions';
import { eq } from 'drizzle-orm';
import { getMgmtToken } from '@/lib/auth/auth0-management';
import { requireAuth } from '@/lib/auth/adminAuth';
import hackLog from '@/helpers/logger';
import {
  responseBadRequest,
  responseInternalServerError,
  responseSuccessfulWithData,
} from '@/helpers/responseHelpers';

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAuth();
  if (authError) {
    return authError;
  }

  try {
    const { auth0Sid, userSessionId, revokedByDeviceId } = await req.json();

    if (!auth0Sid || !userSessionId) {
      return responseBadRequest('auth0Sid and userSessionId are required');
    }

    if (!revokedByDeviceId) {
      return responseBadRequest('revokedByDeviceId is required');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userSessionId)) {
      return responseBadRequest('Invalid userSessionId format');
    }

    const token = await getMgmtToken();
    const killResponse = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/sessions/${encodeURIComponent(auth0Sid)}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const success = killResponse.status === 202 || killResponse.status === 204 || killResponse.status === 404;

    if (!success) {
      const errorText = await killResponse.text();
      hackLog.http.response(killResponse.status, 'Auth0 session revocation', { errorText });
      return responseInternalServerError(`Auth0 API returned ${killResponse.status}`);
    }

    await db
      .update(userSessions)
      .set({
        status: 'revoked',
        revokedReason: 'admin_revoked',
        revokedByDeviceId,
        revokedAt: new Date(),
        lastSeen: new Date(),
      })
      .where(eq(userSessions.id, userSessionId));

    return responseSuccessfulWithData({
      message: killResponse.status === 404 
        ? 'Session already expired or revoked in Auth0, database updated'
        : 'Session revoked successfully',
      data: {
        ok: true,
        status: killResponse.status,
      },
    });
  } catch (error) {
    return responseInternalServerError('Failed to revoke session');
  }
}
