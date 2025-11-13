import type { Metadata } from 'next';
import { auth0 } from '@/lib/auth/auth0';
import { redirect } from 'next/navigation';
import PrivatePageContent from '@/components/pages/PrivatePageContent';
import RevokedSessionPage from '@/components/pages/RevokedSessionPage';
import { PageRoutes } from '@/helpers/string_const';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd, generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo/jsonld';
import { siteConfig } from '@/lib/seo/config';
import { getDeviceId } from '@/lib/auth/device';
import { parseUserAgent } from '@/lib/auth/userAgent';
import { syncUser } from '@/lib/db-repo/userService';
import { createOrUpdateSession, checkDeviceLimit, getSessionByDeviceId, getRevokedSessionInfo } from '@/lib/db-repo/sessionService';
import { getAppSettings } from '@/lib/db-repo/appSettingsService';

export const metadata: Metadata = generatePageMetadata({
  title: 'Dashboard',
  description: 'Access your secure dashboard. Manage your account, view active sessions, and control device access.',
  path: '/private',
  keywords: ['dashboard', 'user account', 'secure area', 'private'],
  noIndex: true,
});

export default async function PrivatePage() {
  // Check Auth0 session
  const session = await auth0.getSession();
  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  // Get device ID from cookie
  const deviceId = await getDeviceId();
  if (!deviceId) {
    redirect(PageRoutes.LOGIN);
  }

  // Sync user to database and parse user agent in parallel
  const [user, deviceInfo] = await Promise.all([
    syncUser(session.user),
    parseUserAgent(),
  ]);

  // Check if user has full name and phone number - redirect to phone-number page if not
  if (!user.fullName || !user.phone) {
    redirect(PageRoutes.PHONE_NUMBER);
  }

  // Check if current device has a revoked session
  const currentSession = await getSessionByDeviceId(user.id, deviceId);
  
  if (currentSession && currentSession.status === 'revoked') {
    const revocationInfo = await getRevokedSessionInfo(user.id, deviceId);
    
    if (revocationInfo) {
      return <RevokedSessionPage revocationInfo={{
        revokedAt: revocationInfo.revokedAt.toISOString(),
        revokedReason: revocationInfo.revokedReason,
        revokedByDevice: revocationInfo.revokedByDevice,
      }} />;
    }
  }

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

  const pageSchema = generateWebPageSchema({
    title: 'Dashboard',
    description: 'Access your secure dashboard',
    url: `${siteConfig.url}/private`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Dashboard', url: '/private' },
  ]);

  return (
    <>
      <JsonLd data={[pageSchema, breadcrumbSchema]} />
      <PrivatePageContent 
        user={{
          name: user.displayName ?? undefined,
          email: user.email ?? undefined,
          picture: user.pictureUrl ?? undefined,
          fullName: user.fullName ?? undefined,
          phone: user.phone ?? undefined,
        }} 
      />
    </>
  );
}
