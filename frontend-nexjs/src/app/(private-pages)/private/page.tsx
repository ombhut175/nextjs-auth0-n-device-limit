import type { Metadata } from 'next';
import { auth0 } from '@/lib/auth/auth0';
import { redirect } from 'next/navigation';
import PrivatePageContent from '@/components/pages/PrivatePageContent';
import { PageRoutes } from '../../../helpers/string_const';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd, generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo/jsonld';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Dashboard',
  description: 'Access your secure dashboard. Manage your account, view active sessions, and control device access.',
  path: '/private',
  keywords: ['dashboard', 'user account', 'secure area', 'private'],
  noIndex: true,
});

export default async function PrivatePage() {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  const user = session.user;

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
      <PrivatePageContent user={user} />
    </>
  );
}
