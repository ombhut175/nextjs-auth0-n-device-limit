import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

const DEVICE_COOKIE_NAME = 'device_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function getOrCreateDeviceId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(DEVICE_COOKIE_NAME);
  
  if (existing?.value) {
    return existing.value;
  }
  
  const deviceId = randomUUID();
  cookieStore.set(DEVICE_COOKIE_NAME, deviceId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
  
  return deviceId;
}

export async function getDeviceId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(DEVICE_COOKIE_NAME)?.value;
}
