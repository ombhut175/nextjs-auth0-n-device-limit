import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import hackLog from '@/helpers/logger';

const connectionString = process.env.DATABASE_URL;

if (!connectionString && typeof window === 'undefined') {
  hackLog.env.missing('DATABASE_URL');
  hackLog.console.warn('DATABASE_URL is not set. Database operations will fail at runtime.');
}

export const db = drizzle(connectionString ?? '', { schema });