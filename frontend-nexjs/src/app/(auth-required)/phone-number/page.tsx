import type { Metadata } from 'next';
import PhoneNumberContent from '@/components/pages/PhoneNumberContent';
import { PageRoutes } from '@/helpers/string_const';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { JsonLd, generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/seo/jsonld';
import { siteConfig } from '@/lib/seo/config';
import { getUserByAuth0Id } from '@/lib/db-repo/userService';
import { auth0 } from '@/lib/auth/auth0';
import { redirect } from 'next/navigation';

export const metadata: Metadata = generatePageMetadata({
  title: 'Phone Number Management',
  description: 'Manage your phone number for enhanced account security and two-factor authentication.',
  path: '/phone-number',
  keywords: ['phone number', '2FA', 'two-factor authentication', 'account security'],
  noIndex: true,
});

export default async function PhoneNumberPage() {
  const session = await auth0.getSession();
  
  // Get user from database (already synced by layout)
  const user = await getUserByAuth0Id(session!.user.sub);
  if (!user) {
    // This shouldn't happen since layout syncs user, but handle gracefully
    redirect(PageRoutes.LOGIN);
  }

  // If user already has full name and phone, redirect to dashboard
  if (user.fullName && user.phone) {
    redirect(PageRoutes.PRIVATE);
  }

  const pageSchema = generateWebPageSchema({
    title: 'Phone Number Management',
    description: 'Manage your phone number for enhanced account security',
    url: `${siteConfig.url}/phone-number`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Dashboard', url: '/private' },
    { name: 'Phone Number', url: '/phone-number' },
  ]);

  return (
    <>
      <JsonLd data={[pageSchema, breadcrumbSchema]} />
      <PhoneNumberContent />
    </>
  );
}
