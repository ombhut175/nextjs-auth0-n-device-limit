import type { Metadata } from 'next';
import { auth0 } from '@/lib/auth/auth0';
import { redirect } from 'next/navigation';
import SessionsContent from '@/components/pages/SessionsContent';
import { PageRoutes } from '../../helpers/string_const';
import { syncUser } from '@/lib/db-repo/userService';
import { getAllSessions } from '@/lib/db-repo/sessionService';
import { getDeviceId } from '@/lib/auth/device';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd, generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo/jsonld';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Active Sessions',
  description: 'View and manage all your active device sessions. Monitor login activity and revoke access from any device.',
  path: '/sessions',
  keywords: ['sessions', 'device management', 'active devices', 'security', 'logout'],
  noIndex: true,
});

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; max?: string }>;
}) {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  const [user, currentDeviceId, params] = await Promise.all([
    syncUser(session.user),
    getDeviceId(),
    searchParams,
  ]);

  const sessions = await getAllSessions(user.id);

  const pageSchema = generateWebPageSchema({
    title: 'Active Sessions',
    description: 'View and manage all your active device sessions',
    url: `${siteConfig.url}/sessions`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Dashboard', url: '/private' },
    { name: 'Sessions', url: '/sessions' },
  ]);

  return (
    <>
      <JsonLd data={[pageSchema, breadcrumbSchema]} />
      <SessionsContent
        sessions={sessions}
        currentDeviceId={currentDeviceId}
        error={params.error}
        maxDevices={params.max ? parseInt(params.max) : undefined}
      />
    </>
  );
}
