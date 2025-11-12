import { auth0 } from '@/lib/auth0';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import {
  responseUnauthorized,
  responseBadRequest,
  responseNotFound,
  responseInternalServerError,
  responseSuccessfulWithData,
} from '@/helpers/responseHelpers';

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return responseUnauthorized('Unauthorized');
    }

    const { phoneNumber, countryCode } = await request.json();

    if (!phoneNumber || !countryCode) {
      return responseBadRequest('Phone number and country code are required');
    }

    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) {
      return responseBadRequest('Invalid phone number format');
    }

    const fullPhone = `${countryCode}${cleaned}`;

    const [updatedUser] = await db
      .update(users)
      .set({
        phone: fullPhone,
        updatedAt: new Date(),
      })
      .where(eq(users.auth0Id, session.user.sub))
      .returning();

    if (!updatedUser) {
      return responseNotFound('User not found');
    }

    return responseSuccessfulWithData({
      message: 'Phone number updated successfully',
      data: { phone: updatedUser.phone },
    });
  } catch (error) {
    return responseInternalServerError('Failed to update phone number');
  }
}

export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session) {
      return responseUnauthorized('Unauthorized');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.auth0Id, session.user.sub),
    });

    if (!user) {
      return responseNotFound('User not found');
    }

    return responseSuccessfulWithData({
      message: 'Phone number retrieved successfully',
      data: { phone: user.phone },
    });
  } catch (error) {
    return responseInternalServerError('Failed to fetch phone number');
  }
}
