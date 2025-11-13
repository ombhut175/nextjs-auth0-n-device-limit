import { auth0 } from '@/lib/auth0';
import { revokeSession } from '@/lib/sessionService';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { userSessions } from '@/db/schema/userSessions';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import { getMgmtToken } from '@/lib/auth0-management';
import hackLog from '@/helpers/logger';
import {
  responseUnauthorized,
  responseBadRequest,
  responseInternalServerError,
  responseSuccessful,
  responseNotFound,
} from '@/helpers/responseHelpers';

export async function POST(request: NextRequest) {
  const session = await auth0.getSession();
  
  if (!session) {
    return responseUnauthorized('Unauthorized');
  }

  try {
    const { sessionId, reason } = await request.json();
    
    if (!sessionId) {
      return responseBadRequest('Session ID is required');
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sessionId)) {
      return responseBadRequest('Invalid session ID format');
    }

    // Fetch the session from database to get auth0_sid
    const userSession = await db.query.userSessions.findFirst({
      where: eq(userSessions.id, sessionId),
    });

    if (!userSession) {
      return responseNotFound('Session not found');
    }

    // Security check: Ensure user can only revoke their own sessions
    const currentUser = await db.query.users.findFirst({
      where: eq(users.auth0Id, session.user.sub),
    });

    if (!currentUser || currentUser.id !== userSession.userId) {
      return responseUnauthorized('You can only revoke your own sessions');
    }

    // If session has auth0_sid, revoke it in Auth0
    if (userSession.auth0Sid) {
      try {
        const token = await getMgmtToken();
        const killResponse = await fetch(
          `https://${process.env.AUTH0_DOMAIN}/api/v2/sessions/${encodeURIComponent(userSession.auth0Sid)}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 202/204 = success, 404 = already expired (acceptable)
        const success = killResponse.status === 202 || killResponse.status === 204 || killResponse.status === 404;

        if (!success) {
          const errorText = await killResponse.text();
          hackLog.http.response(killResponse.status, 'Auth0 session revocation', { errorText });
          // Continue to revoke in database even if Auth0 call fails
          // This ensures database consistency
        }
      } catch (auth0Error) {
        hackLog.console.error('Error calling Auth0 Management API', auth0Error);
        // Continue to revoke in database even if Auth0 call fails
      }
    }

    // Update database to mark session as revoked
    await revokeSession(sessionId, reason || 'User revoked');
    
    return responseSuccessful('Session revoked successfully');
  } catch (error) {
    hackLog.console.error('Error revoking session', error);
    return responseInternalServerError('Failed to revoke session');
  }
}
