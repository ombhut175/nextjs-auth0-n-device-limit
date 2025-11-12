import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { getDeviceId } from '@/lib/device';
import { parseUserAgent } from '@/lib/userAgent';
import { syncUser } from '@/lib/userService';
import { createOrUpdateSession } from '@/lib/sessionService';
import { PageRoutes } from '../helpers/string_const';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check Auth0 session
  const session = await auth0.getSession();
  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  // Get device ID from cookie
  const deviceId = await getDeviceId();
  if (!deviceId) {
    // This shouldn't happen since middleware sets it, but handle gracefully
    redirect(PageRoutes.LOGIN);
  }

  // Parse user agent and device info
  const deviceInfo = await parseUserAgent();

  // Sync user to database
  const user = await syncUser(session.user);

  // Create or update session in database
  await createOrUpdateSession(user.id, deviceId, deviceInfo);

  return <>{children}</>;
}