import { auth0 } from '@/lib/auth/auth0';
import { redirect } from 'next/navigation';
import PhoneNumberContent from '@/components/pages/PhoneNumberContent';
import { PageRoutes } from '@/helpers/string_const';

export default async function PhoneNumberPage() {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  return <PhoneNumberContent />;
}
