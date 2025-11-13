import { headers } from 'next/headers';
import { userAgent } from 'next/server';
import hackLog from '@/helpers/logger';

export interface DeviceInfo {
  raw: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  isBot: boolean;
  ip: string;
}

export async function parseUserAgent(): Promise<DeviceInfo> {
  const headersList = await headers();
  const ua = userAgent({ headers: headersList });
  const rawUA = headersList.get('user-agent') || '';
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() || 
             headersList.get('x-real-ip') || 
             'unknown';

  hackLog.dev('Parsed IP address', { ip });
  

  return {
    raw: rawUA,
    browser: ua.browser.name || 'Unknown',
    browserVersion: ua.browser.version || '',
    os: ua.os.name || 'Unknown',
    osVersion: ua.os.version || '',
    device: ua.device.type || 'desktop',
    isBot: ua.isBot,
    ip,
  };
}
