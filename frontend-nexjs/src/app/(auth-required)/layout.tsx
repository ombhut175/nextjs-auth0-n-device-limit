import { auth0 } from '@/lib/auth/auth0';
import { redirect } from 'next/navigation';
import { syncUser } from '@/lib/db-repo/userService';
import { getDeviceId } from '@/lib/auth/device';
import { getSessionByDeviceId } from '@/lib/db-repo/sessionService';
import { PageRoutes } from '@/helpers/string_const';

export default async function AuthRequiredLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check Auth0 session
  const session = await auth0.getSession();
  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  // Sync user to database
  const user = await syncUser(session.user);

  // Get current device ID
  const deviceId = await getDeviceId();

  // Check if current device session is revoked
  if (deviceId) {
    const currentSession = await getSessionByDeviceId(user.id, deviceId);
    if (currentSession && currentSession.status === 'revoked') {
      // Revoked sessions cannot access any auth-required pages
      redirect(PageRoutes.PRIVATE);
    }
  }

  return <>{children}</>;
}
