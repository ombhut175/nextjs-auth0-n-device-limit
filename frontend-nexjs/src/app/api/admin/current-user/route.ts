import { auth0 } from '@/lib/auth/auth0';
import { getUserByAuth0Id } from '@/lib/db-repo/userService';
import {
  responseUnauthorized,
  responseNotFound,
  responseInternalServerError,
  responseSuccessfulWithData,
} from '@/helpers/responseHelpers';

export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return responseUnauthorized('Not authenticated');
    }

    const user = await getUserByAuth0Id(session.user.sub);
    
    if (!user) {
      return responseNotFound('User not found');
    }

    return responseSuccessfulWithData({
      message: 'User retrieved successfully',
      data: {
        userId: user.id,
        auth0Id: user.auth0Id,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    return responseInternalServerError('Failed to fetch user');
  }
}
