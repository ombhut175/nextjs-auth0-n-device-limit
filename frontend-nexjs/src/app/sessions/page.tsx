import { auth0 } from '@/lib/auth/auth0';
import { redirect } from 'next/navigation';
import SessionsContent from '@/components/pages/SessionsContent';
import { PageRoutes } from '../../helpers/string_const';
import { syncUser } from '@/lib/db-repo/userService';
import { getAllSessions } from '@/lib/db-repo/sessionService';
import { getDeviceId } from '@/lib/auth/device';

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

  return (
    <SessionsContent
      sessions={sessions}
      currentDeviceId={currentDeviceId}
      error={params.error}
      maxDevices={params.max ? parseInt(params.max) : undefined}
    />
  );
}
