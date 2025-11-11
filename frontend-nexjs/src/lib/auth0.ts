import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
    domain: process.env.AUTH0_DOMAIN as string,
    clientId: process.env.AUTH0_CLIENT_ID as string,
    clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
    secret: process.env.AUTH0_SECRET as string,
    appBaseUrl: process.env.APP_BASE_URL as string
});
