import { db } from '@/db';
import { users, type User } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

interface Auth0User {
  sub: string;
  name?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  phone_number?: string;
}

export async function syncUser(auth0User: Auth0User): Promise<User> {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.auth0Id, auth0User.sub),
  });

  if (existingUser) {
    // Update existing user
    const [updated] = await db
      .update(users)
      .set({
        displayName: auth0User.name,
        email: auth0User.email,
        emailVerified: auth0User.email_verified ?? false,
        pictureUrl: auth0User.picture,
        phone: auth0User.phone_number,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id))
      .returning();
    
    return updated;
  }

  // Create new user
  const [newUser] = await db
    .insert(users)
    .values({
      auth0Id: auth0User.sub,
      displayName: auth0User.name,
      email: auth0User.email,
      emailVerified: auth0User.email_verified ?? false,
      pictureUrl: auth0User.picture,
      phone: auth0User.phone_number,
    })
    .returning();

  return newUser;
}

export async function getUserByAuth0Id(auth0Id: string): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.auth0Id, auth0Id),
  });
  
  return user || null;
}
