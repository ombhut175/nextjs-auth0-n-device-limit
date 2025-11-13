import { auth0 } from '@/lib/auth/auth0';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDeviceId } from '@/lib/auth/device';
import { syncUser } from '@/lib/db-repo/userService';
import { revokeSessionByDeviceId } from '@/lib/db-repo/sessionService';
import hackLog from '@/helpers/logger';

const DEVICE_COOKIE_NAME = 'device_id';

export async function GET() {
  try {
    // Get current session
    const session = await auth0.getSession();
    
    if (session) {
      // Get device ID
      const deviceId = await getDeviceId();
      
      if (deviceId) {
        try {
          // Sync user to get user ID
          const user = await syncUser(session.user);
          
          // Revoke the current device session
          await revokeSessionByDeviceId(user.id, deviceId, 'User logged out', deviceId);
          
          hackLog.info('Session revoked on logout', { userId: user.id, deviceId });
        } catch (error) {
          // Log error but don't block logout
          hackLog.error('Failed to revoke session on logout', error);
        }
      }
    }
    
    // Clear device_id cookie
    const cookieStore = await cookies();
    cookieStore.delete(DEVICE_COOKIE_NAME);
    hackLog.info('Device ID cookie cleared on logout');
    
    // Redirect to Auth0 logout URL
    const logoutUrl = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);
    logoutUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID as string);
    logoutUrl.searchParams.set('returnTo', process.env.APP_BASE_URL as string);
    
    return NextResponse.redirect(logoutUrl.toString());
  } catch (error) {
    hackLog.error('Logout error', error);
    // Fallback to home page
    return NextResponse.redirect(process.env.APP_BASE_URL as string);
  }
}
