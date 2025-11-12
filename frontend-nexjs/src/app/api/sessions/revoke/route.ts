import { auth0 } from '@/lib/auth0';
import { revokeSession } from '@/lib/sessionService';
import { NextRequest } from 'next/server';
import {
  responseUnauthorized,
  responseBadRequest,
  responseInternalServerError,
  responseSuccessful,
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

    await revokeSession(sessionId, reason || 'User revoked');
    
    return responseSuccessful('Session revoked successfully');
  } catch (error) {
    return responseInternalServerError('Failed to revoke session');
  }
}
