import { NextRequest } from 'next/server';
import { db } from '@/db';
import { userSessions } from '@/db/schema/userSessions';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/adminAuth';
import {
  responseBadRequest,
  responseInternalServerError,
  responseSuccessfulWithData,
} from '@/helpers/responseHelpers';

export async function GET(
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

    const sessions = await db.query.userSessions.findMany({
      where: eq(userSessions.userId, userId),
      orderBy: (sessions, { desc }) => [desc(sessions.lastSeen)],
    });

    return responseSuccessfulWithData({
      message: 'Sessions retrieved successfully',
      data: { sessions },
    });
  } catch (error) {
    return responseInternalServerError('Failed to fetch sessions');
  }
}
