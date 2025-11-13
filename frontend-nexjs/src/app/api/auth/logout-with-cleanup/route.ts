import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { PageRoutes } from '@/helpers/string_const';
import hackLog from '@/helpers/logger';

const DEVICE_COOKIE_NAME = 'device_id';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Clear the device_id cookie
    cookieStore.delete(DEVICE_COOKIE_NAME);
    
    hackLog.info('Device ID cookie cleared during logout');
    
    // Redirect to Auth0 logout
    return NextResponse.redirect(new URL(PageRoutes.LOGOUT, request.url));
  } catch (error) {
    hackLog.error('Error during logout cleanup', error);
    // Still redirect to logout even if cleanup fails
    return NextResponse.redirect(new URL(PageRoutes.LOGOUT, request.url));
  }
}
