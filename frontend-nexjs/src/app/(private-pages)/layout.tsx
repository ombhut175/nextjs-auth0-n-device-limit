import { auth0 } from '@/lib/auth/auth0';
import { redirect } from 'next/navigation';
import { getDeviceId } from '@/lib/auth/device';
import { parseUserAgent } from '@/lib/auth/userAgent';
import { syncUser } from '@/lib/db-repo/userService';
import { createOrUpdateSession, checkDeviceLimit } from '@/lib/db-repo/sessionService';
import { getAppSettings } from '@/lib/db-repo/appSettingsService';
import { PageRoutes } from '../../helpers/string_const';

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

  // Fetch app settings to get device limit
  const appSettings = await getAppSettings();

  // Check if device limit is exceeded
  const { exceeded } = await checkDeviceLimit(
    user.id,
    deviceId,
    appSettings.maxDevices
  );

  // If limit exceeded, redirect to sessions page with error
  if (exceeded) {
    redirect(`${PageRoutes.SESSIONS}?error=limit_exceeded&max=${appSettings.maxDevices}`);
  }

  // Extract Auth0 session ID for precise session tracking
  const auth0Sid = session.internal?.sid;

  // Create or update session in database
  await createOrUpdateSession(user.id, deviceId, deviceInfo, auth0Sid);

  return <>{children}</>;
}