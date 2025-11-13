import type { Metadata } from 'next';
import PublicPageContent from '@/components/pages/PublicPageContent';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd, generateWebPageSchema } from '@/lib/seo/jsonld';
import { siteConfig } from '@/lib/seo/config';

export const metadata: Metadata = generatePageMetadata({
  title: 'Home - Secure Device Session Management',
  description: 'Welcome to NGuard - A secure authentication platform with device-limited session management. Control and monitor your active devices with Auth0 integration.',
  path: '/',
  keywords: ['home', 'authentication platform', 'device security', 'session control'],
});

export default function PublicPage() {
  const pageSchema = generateWebPageSchema({
    title: 'Home - Secure Device Session Management',
    description: 'Welcome to NGuard - A secure authentication platform with device-limited session management.',
    url: siteConfig.url,
  });

  return (
    <>
      <JsonLd data={pageSchema} />
      <PublicPageContent />
    </>
  );
}
