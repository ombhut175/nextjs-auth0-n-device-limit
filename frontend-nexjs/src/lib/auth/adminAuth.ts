import { auth0 } from '@/lib/auth/auth0';
import { responseUnauthorized } from '@/helpers/responseHelpers';

/**
 * Checks if the current user is authenticated
 * Returns the session if authenticated, or an error response if not
 */
export async function requireAuth() {
  const session = await auth0.getSession();
  
  if (!session) {
    return {
      error: responseUnauthorized('Unauthorized - Authentication required'),
      session: null,
    };
  }

  return { error: null, session };
}

/**
 * Validates that the authenticated user can only access their own data
 * or is an admin (future enhancement)
 */
export async function requireAuthForUser(targetUserId: string) {
  const { error, session } = await requireAuth();
  
  if (error) {
    return { error, session: null, user: null };
  }

  // For now, allow any authenticated user to access any user's data
  // In production, you should check if the user is an admin or accessing their own data
  // Example: if (session.user.sub !== targetAuth0Id && !isAdmin(session.user)) { return error }

  return { error: null, session, user: session!.user };
}
