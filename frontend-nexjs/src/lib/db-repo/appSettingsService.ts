"use server"

import { db } from '@/db';
import { appSettings, type AppSettings } from '@/db/schema/appSettings';
import hackLog from '@/helpers/logger';

export async function getAppSettings(): Promise<AppSettings> {
  try {
    hackLog.db.query('SELECT * FROM app_settings LIMIT 1');
    
    const settings = await db.query.appSettings.findFirst();
    
    if (!settings) {
      hackLog.warn('No app settings found in database, using defaults');
      // Return defaults if no settings exist
      return {
        id: '',
        maxDevices: 3,
        inactivityDays: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    
    hackLog.info('App settings loaded', { maxDevices: settings.maxDevices, inactivityDays: settings.inactivityDays });
    return settings;
  } catch (error) {
    hackLog.error('Failed to fetch app settings', error);
    throw error;
  }
}
