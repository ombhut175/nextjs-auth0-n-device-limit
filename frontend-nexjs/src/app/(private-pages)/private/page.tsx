import { auth0 } from '@/lib/auth/auth0';
import { redirect } from 'next/navigation';
import PrivatePageContent from '@/components/pages/PrivatePageContent';
import { PageRoutes } from '../../../helpers/string_const';

export default async function PrivatePage() {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect(PageRoutes.LOGIN);
  }

  const user = session.user;

  return <PrivatePageContent user={user} />;
}
